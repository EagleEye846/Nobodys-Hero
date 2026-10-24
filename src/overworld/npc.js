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
// Catching you: it rears back, then throws itself at you, this far and this
// high, over this long (see Npc.pounceOn, and the battle's lead-in in
// OverworldScene).
const LUNGE_SECONDS = 0.34;
const LUNGE_REACH = 7;
const LUNGE_HOP = 5;
// How each kind of enemy gets about (its `gait`, in its file in
// src/data/enemies/), for when it's out walking in a room. `cycle` is one
// stride in seconds, `moving` the share of it spent moving (and `pace` how
// fast, as a multiple of the usual speed; the rest is a pause), `height` how
// high a hop goes, in pixels. Drawing is in Npc.drawBody.
//   walk    the usual: a gentle bob
//   fly     hovers well off the ground, bobbing, its shadow below
//   hop     little hops with a pause between (the bunny)
//   bound   big leaps and longer pauses (the craghorn, a goat)
//   roll    tumbles over and over as it goes (boulders: the stone golem)
//   stomp   heavy shuffles that thud down (stone steps, the pillar)
//   ooze    slow, squashing and stretching like a heap of snow (the frostbite)
//   dash    darts, then freezes (the glintling)
//   swing   rocks back and forth like a hanging ring (the ringer)
//   float   drifts, and flickers (the shade)
//   waddle  rocks side to side as it walks (the dummy, the waxling)
export const GAITS = {
  walk: { cycle: 1, moving: 1, pace: 1 },
  fly: { cycle: 1, moving: 1, pace: 1.1 },
  hop: { cycle: 0.7, moving: 0.45, pace: 1.8, height: 6 },
  bound: { cycle: 1.2, moving: 0.5, pace: 2.2, height: 12 },
  roll: { cycle: 1, moving: 1, pace: 1 },
  stomp: { cycle: 0.7, moving: 0.3, pace: 2.6, height: 3 },
  ooze: { cycle: 1, moving: 1, pace: 0.65 },
  dash: { cycle: 1.5, moving: 0.25, pace: 4 },
  swing: { cycle: 1, moving: 1, pace: 0.9 },
  float: { cycle: 1, moving: 1, pace: 0.8 },
  waddle: { cycle: 1, moving: 1, pace: 0.9 },
};

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
    // How it gets about (GAITS): its own way of walking.
    this.gait = GAITS[ENEMIES[enemy]?.gait] ? ENEMIES[enemy].gait : 'walk';
    // How far into its stride it is, how far it's rolled, and whether it moved this frame.
    this.stride = Math.random();
    this.roll = 0;
    this.moving = false;
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
    this.lunge = null;
  }

  // It's caught you: a "!" (if it hadn't already seen you), and it lunges.
  pounceOn(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const surprised = this.alert <= 0;
    this.alert = ALERT_SECONDS;
    this.lunge = { t: 0, dx: dx / d, dy: dy / d };
    return surprised;
  }

  // How far along its lunge it is: back a pixel or two, then at you, then
  // it holds there, right up against you.
  lungeOffset() {
    if (!this.lunge) return { x: 0, y: 0, lift: 0 };
    const k = Math.min(1, this.lunge.t / LUNGE_SECONDS);
    const reach = k < 0.3 ? -2 * (k / 0.3) : -2 + (LUNGE_REACH + 2) * Math.min(1, (k - 0.3) / 0.4);
    const lift = k < 0.3 ? 0 : Math.round(Math.sin(Math.min(1, (k - 0.3) / 0.7) * Math.PI) * LUNGE_HOP);
    return { x: Math.round(this.lunge.dx * reach), y: Math.round(this.lunge.dy * reach), lift };
  }

  get sortY() {
    return this.y;
  }

  // How fast it's going right now, as a multiple of its speed: hoppers and
  // darters move in bursts with pauses between, oozers slowly, and so on.
  pace(dt) {
    const gait = GAITS[this.gait];
    this.stride = (this.stride + dt / gait.cycle) % 1;
    return this.stride < gait.moving ? gait.pace : 0;
  }

  update(dt, player, room) {
    if (this.lunge) {
      this.lunge.t += dt;
      this.time += dt;
      this.alert = Math.max(0, this.alert - dt);
      return;
    }
    const before = { x: this.x, y: this.y };
    this.updateMovement(dt, player, room);
    const moved = Math.hypot(this.x - before.x, this.y - before.y);
    this.moving = moved > 0.01;
    // A roller turns over as it goes: once round for every lap of its edge.
    if (this.gait === 'roll' && this.moving) this.roll += (moved / Math.max(4, this.sprite.width / 2)) * Math.sign(this.x - before.x || 1);
  }

  updateMovement(dt, player, room) {
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
    this.x += this.direction * SPEED * this.pace(dt) * dt;
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
    const speed = SPEED * this.pace(dt);
    if (distance < 1) {
      wander.target = null;
      wander.pause = rand(...WANDER_PAUSE);
      return;
    }
    if (speed > 0 && !this.step(room, (dx / distance) * speed * dt, (dy / distance) * speed * dt)) {
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
    // Bursty gaits keep their rhythm in a chase, at the same average speed.
    const gait = GAITS[this.gait];
    const speed = CHASE_SPEED * this.pace(dt) / (gait.moving * gait.pace || 1) * Math.min(1, gait.pace);
    this.step(room, (dx / distance) * speed * dt, (dy / distance) * speed * dt);
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

  // Its shadow in the sun (see shadows.js): in disguise, the disguise's.
  shadow() {
    const disguised = this.lurking && this.behaviour === 'disguise' && this.disguiseFrames;
    return { image: disguised ? this.disguiseFrames[0] : this.sprite, x: this.x, y: this.y };
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
    const lunge = this.lungeOffset();
    const top = this.drawBody(ctx, x + lunge.x, y + lunge.y, lunge.lift);
    if (this.alert > 0) drawAlert(ctx, x, top - 12);
  }

  // The enemy itself, its own way (GAITS), standing at (x, y): its shadow on
  // the ground, then the sprite lifted, turned or squashed. Returns the top of it.
  drawBody(ctx, x, y, extraLift = 0) {
    const t = this.time;
    const gait = GAITS[this.gait];
    const w = this.sprite.width;
    const h = this.sprite.height;
    // How far off the ground, turned (radians, about `pivot`), stretched and see-through.
    let lift = Math.round(Math.sin(t * 3) * 2) + 2;
    let angle = 0;
    let pivot = 'feet';
    let sx = 1;
    let sy = 1;
    let alpha = 1;
    let shadow = 1;
    const hopping = this.moving && this.stride < gait.moving;
    const hopArc = Math.sin((this.stride / gait.moving) * Math.PI);
    switch (this.gait) {
      case 'fly':
        lift = 12 + Math.round(Math.sin(t * 4) * 3);
        shadow = 0.6;
        break;
      case 'hop':
      case 'bound':
        lift = hopping ? Math.round(hopArc * gait.height) : 0;
        // Squashed for a moment as it lands.
        if (!hopping && this.moving && this.stride < gait.moving + 0.08) { sx = 1.15; sy = 0.87; }
        shadow = 1 - lift / 40;
        break;
      case 'roll':
        lift = 0;
        angle = Math.round(this.roll * 4 / Math.PI) * (Math.PI / 4);
        pivot = 'middle';
        break;
      case 'stomp':
        lift = hopping ? Math.round(hopArc * gait.height) : 0;
        if (!hopping && this.moving && this.stride < gait.moving + 0.1) { sx = 1.08; sy = 0.92; }
        break;
      case 'ooze':
        lift = 0;
        sx = 1 + Math.sin(t * 4) * 0.12;
        sy = 1 / sx;
        break;
      case 'dash':
        lift = 0;
        // Leaning into the dart.
        if (hopping) angle = 0.18 * this.direction;
        break;
      case 'swing':
        lift = 4;
        angle = Math.sin(t * 2.6) * 0.35;
        pivot = 'top';
        break;
      case 'float':
        lift = 6 + Math.round(Math.sin(t * 1.8) * 3);
        alpha = 0.7 + Math.sin(t * 5) * 0.2;
        shadow = 0.7;
        break;
      case 'waddle':
        angle = this.moving ? Math.sin(t * 7) * 0.14 : 0;
        lift = 0;
        break;
      default:
        break;
    }
    lift += this.z + extraLift;
    // Rearing back before a lunge: squashed down, ready to spring.
    if (this.lunge && this.lunge.t < LUNGE_SECONDS * 0.3) { sx = 1.12; sy = 0.88; }
    // The shadow stays on the ground, smaller the higher it is.
    const sw = Math.max(4, Math.round(10 * shadow));
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x - Math.floor(sw / 2), y - 3, sw, 3);

    const bottom = y - 2 - lift;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (!angle && sx === 1 && sy === 1) {
      ctx.drawImage(this.sprite, x - Math.floor(w / 2), bottom - h);
    } else {
      const py = pivot === 'top' ? bottom - h : pivot === 'middle' ? bottom - h / 2 : bottom;
      ctx.translate(x, py);
      ctx.rotate(angle);
      ctx.scale(sx, sy);
      const oy = pivot === 'top' ? 0 : pivot === 'middle' ? -h / 2 : -h;
      ctx.drawImage(this.sprite, -Math.floor(w / 2), oy);
    }
    ctx.restore();
    return bottom - h;
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
