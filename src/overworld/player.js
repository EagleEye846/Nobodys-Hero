import { TILE_SIZE as T } from '../config.js';
import { drawFootShadow } from './shadows.js';
import { HERO_ANIMATIONS, chooseFacing, heroFrame, heroBounce, carryFrame } from '../characters/hero.js';
import { animationFrame } from '../engine/animations.js';
import { skillBonus } from '../characters/progress.js';
import { memberFrames, memberSprites } from '../characters/party.js';
import { actPose, poseOffset, drawPosed, startAct } from './acts.js';

const WALK_SPEED = 70; // pixels per second
const RUN_SPEED = 130;
// Carrying someone on your back: slower, and no running or jumping.
const CARRY_SPEED = 56;
// On a crutch (Ves, when you steer her in the Dead City): slower still.
const CRUTCH_SPEED = 48;

const JUMP_SPEED = 150; // pixels per second, upwards
const GRAVITY = 700; // pixels per second squared
// Pressing jump this long before landing still counts, so mashing feels responsive.
const JUMP_BUFFER = 0.12;
// How high a jump reaches (about 16 pixels): enough to get up onto a block one
// step higher (a `raise` of 12, see tileset.js), but not two (24). The Acrobat
// skill (`jumpHeight`) adds a step.
export const JUMP_REACH = (JUMP_SPEED * JUMP_SPEED) / (2 * GRAVITY);
const jumpSpeed = () => Math.sqrt(2 * GRAVITY * (JUMP_REACH + skillBonus('jumpHeight')));

// On ice (`z` tiles) you slide: pushing builds speed slowly, and it bleeds
// away slowly, so you skate, overshoot, and bump into things.
const ICE_ACCEL = 260; // pixels per second squared
const ICE_MAX_SPEED = 120;
const ICE_FRICTION = 0.28; // speed left after a second of coasting
const ICE_BOUNCE = 0.3; // speed kept, reversed, when you hit something

// In a current (the Old Drains: a `flow` prop) you're carried along at this
// speed, and pulled into the middle of its lane at the other.
const CURRENT_SPEED = 96; // pixels per second
const CURRENT_PULL = 60;
export const FLOW_DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// After the floor breaks, the player hangs in the air this long before dropping.
const FALL_PAUSE = 0.25;
const FALL_GRAVITY = 500;

// Collision box around the feet, so the head can overlap walls like in Deltarune.
const HITBOX_HALF_WIDTH = 5;
const HITBOX_HEIGHT = 6;

// Landing squashes you for a moment (wide and short, then a touch tall),
// and pushing off for a jump stretches you.
const LAND_SQUASH = [[0.05, 1.18, 0.82], [0.1, 1.08, 0.92], [0.15, 0.96, 1.05]];
const TAKEOFF_STRETCH = 0.1;
// Left standing a while, you look about: first after this many seconds, then
// again every so often.
const GLANCE_AFTER = 6;
const GLANCE_EVERY = 9;
const now = () => performance.now() / 1000;

// Standing on a stepping-stone in the water, you're drawn this much higher
// (up on top of it).
export const STONE_LIFT = 2;
// The sway, in whole pixels, `t` seconds into keeping your balance: a slow
// lean one way and the other, and every few seconds a quick wobble.
export function swayAt(t) {
  const wobble = (t % 3.2) > 2.7 ? Math.sin(t * 28) * 1.4 : 0;
  return Math.round(Math.sin(t * 3.1) * 0.9 + wobble);
}

export class Player {
  // (x, y) is the point between the player's feet, in whole pixels.
  // `skin` is a party member to be instead of the hero (Bramble, when you
  // switch to him with Q: see hushwood.js), drawn with their walking frames;
  // a `small` one fits through kid gaps.
  // A `crutch` (Ves, hurt) walks slowly, and can't run or jump.
  constructor(x, y, { skin = null, small = false, crutch = false } = {}) {
    this.skin = skin;
    this.small = small;
    this.crutch = crutch;
    this.x = x;
    this.y = y;
    this.remainderX = 0;
    this.remainderY = 0;
    this.facing = 'down';
    this.moving = false;
    this.running = false;
    this.animationTime = 0;

    // Height above what they're standing on (`ground`: the floor, or the top
    // of a raised block). Walking into a block works only when they're up as
    // high as its top; walking off one drops them down.
    this.ground = 0;
    this.z = 0;
    this.velocityZ = 0;
    this.jumpBufferTime = 0;
    this.landedThisFrame = false;

    this.hole = null; // set once the player is falling into a broken tile
    this.fallTime = 0;
    // How far into the marsh's bog they've gone, 0 to 1 (see OverworldScene.checkBog).
    this.sinking = 0;
    // Up on a stepping-stone in the water (a sunk log or rock), and how long
    // they've been keeping their balance there (see OverworldScene.balance).
    this.balancing = false;
    this.balanceTime = 0;
    // A party member riding on the hero's back (Ves, hurt, from the stilt
    // hut in the Lantern Marsh on: WORLD_STATE.carrying), or null. Carrying
    // her, you walk (slower), and can't run, jump or climb a rope.
    this.carrying = null;

    // Something they're doing with their whole body (see acts.js): set by a
    // cutscene's `act` step, or a start as an enemy catches you.
    this.act = null;
    // How long they've stood still (for looking about), when they last
    // landed and last jumped (for squashing), and how far down the bridge
    // they're on has sagged under them (set by the overworld: bridges.js).
    this.stillFor = 0;
    this.landedAt = -1;
    this.jumpedAt = -1;
    this.sag = 0;
  }

  // Starts an act (see acts.js) now.
  perform(name) {
    this.act = startAct(name, now(), this.facing);
  }

  // Up on a block, drawn after it (see Room.findStandingTiles), but still
  // before a block in front, which can hide your feet.
  get sortY() {
    // Crawling through a hole in something standing (a hedge, a wall's cat
    // flap): behind it, so you see them through the hole (see draw).
    const gap = this.squeezing && this.squeezeGap;
    if (gap && !gap.floorGap) return gap.sortY - 0.01;
    return this.ground > 0 ? this.y + T - 1 : this.y;
  }

  get isAirborne() {
    return this.z > 0 || this.velocityZ > 0;
  }

  get isFalling() {
    return this.hole !== null;
  }

  update(dt, input, room) {
    this.landedThisFrame = false;

    if (this.isFalling) {
      this.fallTime += dt;
      return;
    }

    const dx = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    const dy = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);

    // In a current, the water has other ideas altogether.
    const flow = this.currentUnder(room);
    if (flow) {
      this.rideCurrent(dt, room, flow, dx, dy);
      return;
    }
    this.carried = false;

    // On ice, the ground has other ideas about where you're going.
    if (this.onIce(room) && !this.isAirborne) {
      this.slideOn(dt, room, dx, dy);
      this.updateJump(dt, input);
      return;
    }
    this.slide = null;
    this.moving = dx !== 0 || dy !== 0;

    if (this.moving) {
      this.facing = chooseFacing(dx, dy, this.facing);

      // Diagonals aren't normalised, matching Deltarune's movement feel.
      this.running = input.isDown('cancel') && !this.carrying && !this.crutch;
      const speed = this.crutch ? CRUTCH_SPEED : this.carrying ? CARRY_SPEED : this.running ? RUN_SPEED * (1 + skillBonus('runSpeed')) : WALK_SPEED;
      this.moveAxis(room, 'x', dx * speed * dt);
      this.moveAxis(room, 'y', dy * speed * dt);

      this.animationTime += dt;
    } else {
      this.animationTime = 0;
    }
    this.stillFor = this.moving || this.isAirborne ? 0 : this.stillFor + dt;
    this.freeAt = now();

    this.updateJump(dt, input);
  }

  // Standing on ice (a `z` tile), at floor level.
  onIce(room) {
    const [tx, ty] = this.tilePosition();
    return this.ground === 0 && room.tileAt(tx, ty) === 'z';
  }

  // The way the current runs where you're standing, at floor level, or null.
  currentUnder(room) {
    if (this.ground !== 0 || this.isAirborne || !room.flowAt) return null;
    const [tx, ty] = this.tilePosition();
    return room.flowAt(tx, ty);
  }

  // Carried along: the water takes you its way, and pulls you into the
  // middle of its lane, and you can't fight it or jump out of it. Only once
  // it's pinned you against something can you step out of it, sideways. At
  // its end it leaves you on the floor just past it.
  rideCurrent(dt, room, flow, dx, dy) {
    const [fx, fy] = FLOW_DIRS[flow];
    const [tx, ty] = this.tilePosition();
    const blockedAhead = () => this.collidesAt(room, this.x + fx, this.y + fy) || this.floorAt(room, this.x + fx, this.y + fy) > 0;
    const sx = fx ? 0 : dx;
    const sy = fy ? 0 : dy;
    // Into the middle of the lane first (stepping in from the side, you're
    // still half on the bank), unless you're stepping out of it.
    if (!(sx || sy) || !blockedAhead()) {
      const axis = fx ? 'y' : 'x';
      const off = (fx ? ty * T + 12 : tx * T + T / 2) - this[axis];
      if (off) this.moveAxis(room, axis, Math.sign(off) * Math.min(Math.abs(off), CURRENT_PULL * dt));
    }
    const pinned = blockedAhead();
    if (pinned) {
      if (sx || sy) {
        this.facing = chooseFacing(sx, sy, this.facing);
        this.moveAxis(room, 'x', sx * WALK_SPEED * dt);
        this.moveAxis(room, 'y', sy * WALK_SPEED * dt);
      }
    } else {
      this.facing = flow;
      this.moveAxis(room, 'x', fx * CURRENT_SPEED * dt);
      this.moveAxis(room, 'y', fy * CURRENT_SPEED * dt);
    }
    this.carried = !pinned;
    this.moving = false;
    this.running = false;
    this.animationTime = 0;
    this.jumpBufferTime = 0;
  }

  get isSliding() {
    return Boolean(this.slide) && Math.hypot(this.slide.vx, this.slide.vy) > 8;
  }

  // Skating: input pushes, the ice keeps you going, walls take it out of you.
  slideOn(dt, room, dx, dy) {
    this.slide ??= { vx: 0, vy: 0 };
    const slide = this.slide;
    slide.vx += dx * ICE_ACCEL * dt;
    slide.vy += dy * ICE_ACCEL * dt;
    const keep = ICE_FRICTION ** dt;
    slide.vx *= keep;
    slide.vy *= keep;
    const speed = Math.hypot(slide.vx, slide.vy);
    if (speed > ICE_MAX_SPEED) {
      slide.vx *= ICE_MAX_SPEED / speed;
      slide.vy *= ICE_MAX_SPEED / speed;
    }
    if (dx || dy) this.facing = chooseFacing(dx, dy, this.facing);
    else if (speed > 20) this.facing = chooseFacing(Math.sign(Math.round(slide.vx)), Math.sign(Math.round(slide.vy)), this.facing);
    const wasX = this.x;
    const wasY = this.y;
    this.moveAxis(room, 'x', slide.vx * dt);
    this.moveAxis(room, 'y', slide.vy * dt);
    if (Math.abs(slide.vx * dt) >= 1 && this.x === wasX) slide.vx = -slide.vx * ICE_BOUNCE;
    if (Math.abs(slide.vy * dt) >= 1 && this.y === wasY) slide.vy = -slide.vy * ICE_BOUNCE;
    this.running = false;
    this.moving = speed > 12;
    // Feet going, but slowly: you're gliding, not walking.
    if (this.moving) this.animationTime += dt * 0.45;
    else this.animationTime = 0;
  }

  updateJump(dt, input) {
    this.jumpBufferTime = Math.max(0, this.jumpBufferTime - dt);

    if (this.isAirborne) {
      if (input.wasPressed('jump')) this.jumpBufferTime = JUMP_BUFFER;
      this.velocityZ -= GRAVITY * dt;
      this.z += this.velocityZ * dt;
      if (this.z <= 0) {
        this.z = 0;
        this.velocityZ = 0;
        this.landedThisFrame = true;
        this.landedAt = now();
      }
      return;
    }

    // Not with someone on your back, or on a crutch.
    if (this.carrying || this.crutch) {
      this.jumpBufferTime = 0;
      return;
    }
    if (input.wasPressed('jump') || this.jumpBufferTime > 0) {
      this.jumpBufferTime = 0;
      this.velocityZ = jumpSpeed();
      this.jumpedAt = now();
    }
  }

  // Moves one pixel at a time and stops at the first solid pixel. Fractional
  // movement is carried over between frames so position stays a whole number.
  moveAxis(room, axis, amount) {
    const remainderKey = axis === 'x' ? 'remainderX' : 'remainderY';
    this[remainderKey] += amount;
    let pixels = Math.round(this[remainderKey]);
    this[remainderKey] -= pixels;

    const step = Math.sign(pixels);
    while (pixels !== 0) {
      const nextX = axis === 'x' ? this.x + step : this.x;
      const nextY = axis === 'y' ? this.y + step : this.y;
      if (this.collidesAt(room, nextX, nextY)) {
        this[remainderKey] = 0;
        return;
      }
      // A block's side is a wall unless they're up as high as its top.
      const height = this.ground + this.z;
      const floor = this.floorAt(room, nextX, nextY);
      if (floor > height + 0.5) {
        this[remainderKey] = 0;
        return;
      }
      this.x = nextX;
      this.y = nextY;
      pixels -= step;
      // Stepping up onto a block, or off one (and dropping down to the floor below).
      if (floor !== this.ground) {
        this.ground = floor;
        this.z = Math.max(0, height - floor);
      }
    }
  }

  collidesAt(room, x, y) {
    return room.collides(x - HITBOX_HALF_WIDTH, y - HITBOX_HEIGHT, x + HITBOX_HALF_WIDTH, y, true, this.small);
  }

  // The highest floor under the feet at (x, y): 0, or a block's top.
  floorAt(room, x, y) {
    return room.floorHeight(x - HITBOX_HALF_WIDTH, y - HITBOX_HEIGHT, x + HITBOX_HALF_WIDTH, y);
  }

  // The tile under the player's feet.
  tilePosition() {
    return [Math.floor(this.x / T), Math.floor((this.y - 1) / T)];
  }

  // The point just in front of the player, checked when they press confirm.
  interactionPoint() {
    switch (this.facing) {
      case 'up': return [this.x, this.y - HITBOX_HEIGHT - 4];
      case 'down': return [this.x, this.y + 4];
      case 'left': return [this.x - HITBOX_HALF_WIDTH - 4, this.y - HITBOX_HEIGHT / 2];
      case 'right': return [this.x + HITBOX_HALF_WIDTH + 4, this.y - HITBOX_HEIGHT / 2];
    }
  }

  // That point, then the two ends of the side you're facing: whatever stops
  // you there is in reach, even if it only catches a corner of you (stepped
  // up onto a block with your feet still over its front edge, say).
  interactionPoints() {
    const [x, y] = this.interactionPoint();
    const across = this.facing === 'up' || this.facing === 'down'
      ? [[this.x - HITBOX_HALF_WIDTH, y], [this.x + HITBOX_HALF_WIDTH - 1, y]]
      : [[x, this.y - HITBOX_HEIGHT], [x, this.y - 1]];
    return [[x, y], ...across];
  }

  // Centres the player over the broken tile and starts the fall.
  fallInto(tx, ty) {
    this.hole = { x: tx * T, y: ty * T };
    this.x = this.hole.x + T / 2;
    this.y = this.hole.y + T - 4;
    this.facing = 'down';
    this.moving = false;
    this.ground = 0;
    this.z = 0;
    this.velocityZ = 0;
    this.fallTime = 0;
  }

  // Your shadow in the sun (see shadows.js): on the ground under you, even
  // mid-jump.
  shadow() {
    if (this.hidden || this.isFalling) return null;
    return { image: this.currentFrame(), x: this.x, y: this.y - this.ground };
  }

  // The frame to show: the hero's, or the member's they're being (their
  // walking and running frames, the way they face; or their one sprite).
  // `look` shows them standing facing some other way for now.
  currentFrame(look = null) {
    if (!this.skin && this.carrying) return carryFrame(this.facing, this.moving, this.animationTime);
    if (!this.skin) return heroFrame(look ?? this.facing, this.moving && !look, this.isAirborne, this.animationTime, this.running);
    // Squeezing through a gap only a kid fits (set by OverworldScene): on
    // hands and knees, crawling the way he's going ('bramble_crawl_left'...).
    if (this.squeezing) {
      const crawl = animationFrame(`${this.skin}_crawl_${this.facing}`, this.moving ? this.animationTime : 0, 0.22);
      if (crawl) return crawl;
    }
    const frames = memberFrames(this.skin);
    const facing = look ?? this.facing;
    if (!frames) return facing === 'left' ? memberSprites(this.skin).left : memberSprites(this.skin).right;
    if (look || !this.moving || this.isAirborne) return frames[`${facing}Idle`];
    if (this.running) return frames[`${this.facing}${Math.floor(this.animationTime / 0.12) % 2 ? 'Pass' : 'Stride'}`];
    return frames[`${this.facing}${Math.floor(this.animationTime / 0.18) % 2 ? 'Step' : 'Idle'}`];
  }

  draw(ctx, camera) {
    // Hidden while you're drawn as part of something else (asleep in a bed,
    // or keeping still in a leaf pile: `tucked`, see OverworldScene.updateHush).
    if (this.hidden || this.tucked) return;
    if (this.isFalling) {
      this.drawFalling(ctx, camera);
      return;
    }
    // Crawling through a hole in something standing: nothing of them shows
    // above its top (their hair, the hatchet), only what the hole shows.
    const gap = this.squeezing && this.squeezeGap;
    if (gap && !gap.floorGap) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(-10000, -10000, 20000, 20000);
      // (A few pixels into it too: a hedge's top edge is ragged, with gaps.)
      ctx.rect(gap.x - camera.x, gap.y - camera.y - 10000, gap.width, 10000 + 4);
      ctx.clip('evenodd');
      this.drawBody(ctx, camera);
      ctx.restore();
      return;
    }
    this.drawBody(ctx, camera);
  }

  // Them, as they are this frame (see draw).
  drawBody(ctx, camera) {
    // A cutscene can have you play an animation (the dive off the summit).
    if (this.sceneAnimation) {
      const a = this.sceneAnimation;
      const frame = animationFrame(a.name, performance.now() / 1000 - a.start, a.speed, a.once);
      if (frame) {
        this.drawFrame(ctx, camera, frame, this.y);
        return;
      }
    }
    // On the ground, a fainter one: in the air it stays put and darkens.
    this.drawShadow(ctx, camera, this.isAirborne ? 0.4 : 0.3);
    // Running has its own frames and a little bounce. Whatever they're
    // doing (an act, a landing, looking about) moves or squashes it.
    const t = now();
    const pose = actPose(this.act, t);
    if (this.act && !pose) this.act = null;
    if (this.moving) this.stillFor = 0;
    const frame = this.currentFrame(pose?.look ?? this.glance());
    const bounce = this.skin ? 0 : heroBounce(this.moving, this.isAirborne, this.animationTime, this.running);
    const off = poseOffset(pose, this.facing);
    const feet = this.y - this.ground - Math.round(this.z) - bounce - (this.balancing ? STONE_LIFT : 0) + this.sag + off.y;
    // Going down into the bog: drawn lower and lower, hidden below the mud.
    if (this.sinking > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, ctx.canvas.width, feet - 2 - camera.y);
      ctx.clip();
      this.drawFrame(ctx, camera, frame, feet + Math.round(this.sinking * (frame.height + 2)));
      ctx.restore();
      return;
    }
    const [sx, sy] = this.squash(t, pose);
    this.drawFrame(ctx, camera, frame, feet, sx, sy, off.x);
  }

  // How squashed to draw them now: by an act, or just landed or jumping.
  squash(t, pose) {
    if (pose) return [pose.sx, pose.sy];
    const since = t - this.landedAt;
    const squash = LAND_SQUASH.find(([until]) => since < until);
    if (squash && !this.isAirborne) return [squash[1], squash[2]];
    if (t - this.jumpedAt < TAKEOFF_STRETCH && this.velocityZ > 0) return [0.9, 1.12];
    return [1, 1];
  }

  // Left standing a while, a look one way and then the other (from facing
  // you or away; side-on, a look toward you), or null.
  glance() {
    // (Only while you're free to move: not mid-conversation, or in a cutscene.)
    if (now() - (this.freeAt ?? -1) > 0.1) this.stillFor = 0;
    if (this.stillFor < GLANCE_AFTER || this.carrying || this.balancing || this.tucked) return null;
    const k = (this.stillFor - GLANCE_AFTER) % GLANCE_EVERY;
    const sides = this.facing === 'down' || this.facing === 'up' ? ['left', 'right'] : ['down', this.facing];
    return k < 0.7 ? sides[0] : k < 1.4 ? sides[1] : null;
  }

  drawShadow(ctx, camera, alpha = 0.4) {
    drawFootShadow(ctx, Math.round(this.x - camera.x), Math.round(this.y - this.ground - camera.y), alpha);
  }

  // Drops the sprite into the hole, hiding whatever has passed below the hole's near edge.
  drawFalling(ctx, camera) {
    const dropTime = Math.max(0, this.fallTime - FALL_PAUSE);
    const drop = Math.round(0.5 * FALL_GRAVITY * dropTime * dropTime);
    const holeX = this.hole.x - camera.x;
    const holeY = this.hole.y - camera.y;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, holeY);
    ctx.rect(holeX, holeY, T, T);
    ctx.clip();
    this.drawFrame(ctx, camera, HERO_ANIMATIONS.down[0], this.y + drop);
    ctx.restore();
  }

  drawFrame(ctx, camera, frame, feetY, sx = 1, sy = 1, dx = 0) {
    drawPosed(ctx, frame, this.x + this.balanceSway() + dx - camera.x, feetY - camera.y, sx, sy);
  }

  // Keeping their balance on a stepping-stone: a little sway from side to
  // side, and now and then a wobble, as it rocks under them.
  balanceSway() {
    if (!this.balancing || this.moving) return 0;
    return swayAt(this.balanceTime);
  }
}
