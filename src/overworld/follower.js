import { TILE_SIZE as T } from '../config.js';
import { drawFootShadow } from './shadows.js';
import { MEMBERS, memberSprites, memberFrames } from '../characters/party.js';
import { STONE_LIFT, swayAt } from './player.js';
import { actPose, poseOffset, drawPosed, startAct } from './acts.js';
import { animationFrame } from '../engine/animations.js';

// A party member following the hero round the world. They walk the path the
// hero walked, a little way behind, so they come round corners rather than
// cutting them; they stop when the hero stops; they go through anything in
// the way (they're small, and the hero already found the route). On the
// rope they vanish (nobody's carrying them up a cliff) and reappear at the
// hero's feet when the climb is over.

// How far behind the hero they walk, along the hero's path, in pixels.
const GAP = 22;
// Points closer together than this aren't worth remembering.
const TRAIL_STEP = 2;
const BOB_SECONDS = 0.2;
// With walking frames: how long each step frame shows, walking and running.
const STEP_SECONDS = 0.18;
const RUN_STEP_SECONDS = 0.12;
// Faster than this (pixels a second) and they're running to keep up; once
// running, they keep it up till they're down below WALK_PACE. (One line for
// both and, catching up after you jump the bog, they'd flick between walking
// and running every frame.)
const RUN_PACE = 85;
const WALK_PACE = 65;
// Once you've stopped, they turn to look at you after this long; then now
// and then they glance off somewhere else for a moment.
const TURN_TO_HERO = 0.7;
const GLANCE_EVERY = [5, 9];
const GLANCE_SECONDS = 0.8;
const now = () => performance.now() / 1000;

export class Follower {
  constructor(id, x, y) {
    this.id = id;
    this.member = MEMBERS[id];
    // Which way they're heading, for members with frames for each way.
    this.dir = 'down';
    this.running = false;
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.walking = false;
    this.hidden = false;
    this.time = 0;
    // The hero's recent path, newest last.
    this.trail = [{ x, y }];
    // Up on a block (the hero's `ground` where they walked): drawn up there,
    // and after the block (see Player.sortY).
    this.ground = 0;
    // Standing about: how long for, and when they'll next glance off (and which way).
    this.stillFor = 0;
    this.nextGlance = GLANCE_EVERY[0];
    this.glanceDir = null;
    // An act (see acts.js), and how far a bridge has sagged under them (bridges.js).
    this.act = null;
    this.sag = 0;
  }

  perform(name) {
    this.act = startAct(name, now(), this.dir);
  }

  // Their look, fetched fresh each time (party.js keeps them made), so it
  // changes the moment they're hurt or healed: Ves off her crutch the
  // minute she has her umbrella back, say.
  get sprites() {
    return memberSprites(this.id);
  }

  get frames() {
    return memberFrames(this.id);
  }

  get sortY() {
    return this.ground > 0 ? this.y + T - 1 : this.y;
  }

  // Put them at a spot, forgetting the path (arriving in a room, or off the rope).
  warpTo(x, y) {
    this.x = x;
    this.y = y;
    this.trail = [{ x, y }];
    this.ground = 0;
    this.walking = false;
  }

  // In a spire room the hero's x wraps round; the path has to come too.
  shift(dx) {
    this.x += dx;
    for (const point of this.trail) point.x += dx;
  }

  // `place` is where they are in the line behind you (0 first, 1 behind
  // them...): each walks a step further back along your path, so two
  // friends don't fight over the same spot.
  update(dt, hero, place = 0) {
    this.time += dt;
    const last = this.trail[this.trail.length - 1];
    if (Math.hypot(hero.x - last.x, hero.y - last.y) >= TRAIL_STEP) this.trail.push({ x: hero.x, y: hero.y, ground: hero.ground });
    // Walk back along the path from the hero until we're GAP behind.
    let remaining = GAP * (place + 1);
    let target = this.trail[this.trail.length - 1];
    for (let i = this.trail.length - 1; i > 0 && remaining > 0; i--) {
      const a = this.trail[i];
      const b = this.trail[i - 1];
      const seg = Math.hypot(a.x - b.x, a.y - b.y);
      if (seg >= remaining) {
        const k = remaining / seg;
        target = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ground: (k < 0.5 ? a : b).ground };
        // Everything before this point is history.
        this.trail.splice(0, i - 1);
        remaining = 0;
      } else {
        remaining -= seg;
        target = b;
      }
    }
    if (this.trail.length > 400) this.trail.splice(0, this.trail.length - 400);
    this.ground = target.ground ?? 0;
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.hypot(dx, dy);
    // Keep up with the hero, whatever their pace, but never overshoot.
    const pace = Math.max(60, distance * 6) * dt;
    if (distance <= pace || distance < 1) {
      this.x = target.x;
      this.y = target.y;
      // Keeping up with someone slower than they'd walk (you carrying Ves, or
      // Ves on her crutch) they catch up every frame: they stay in their walk
      // while you're moving, rather than flickering between walking and standing.
      this.walking = distance > 0.5 || Boolean(hero.moving);
    } else {
      this.x += (dx / distance) * pace;
      this.y += (dy / distance) * pace;
      this.walking = true;
    }
    this.running = this.walking && (hero.running || pace / dt > (this.running ? WALK_PACE : RUN_PACE));
    if (Math.abs(dx) > 0.5) this.facing = Math.sign(dx);
    if (distance > 0.5) this.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    this.idle(dt, hero);
  }

  // Stood still: they turn to look at you, and now and then glance about.
  idle(dt, hero) {
    if (this.walking) {
      this.stillFor = 0;
      this.glanceDir = null;
      return;
    }
    this.stillFor += dt;
    const hx = hero.x - this.x;
    const hy = hero.y - this.y;
    if (this.stillFor >= TURN_TO_HERO && this.stillFor - dt < TURN_TO_HERO && Math.hypot(hx, hy) > 4) {
      this.dir = Math.abs(hx) > Math.abs(hy) ? (hx < 0 ? 'left' : 'right') : (hy < 0 ? 'up' : 'down');
      if (Math.abs(hx) > 1) this.facing = Math.sign(hx);
      this.nextGlance = this.stillFor + GLANCE_EVERY[0] + Math.random() * (GLANCE_EVERY[1] - GLANCE_EVERY[0]);
    }
    if (this.stillFor >= this.nextGlance) {
      const others = ['left', 'right', 'down', 'up'].filter((d) => d !== this.dir && d !== 'up');
      this.glanceDir = others[Math.floor(Math.random() * others.length)];
      this.glanceUntil = this.stillFor + GLANCE_SECONDS;
      this.nextGlance = this.stillFor + GLANCE_EVERY[0] + Math.random() * (GLANCE_EVERY[1] - GLANCE_EVERY[0]);
    }
    if (this.glanceDir && this.stillFor >= this.glanceUntil) this.glanceDir = null;
  }

  // The frame to show: with walking frames, the way they're heading, stepping
  // or running; otherwise their one sprite, turned left or right.
  get frame() {
    return this.frameLooking(null);
  }

  // The same, but facing `look` for now, if it's given (or they're glancing off).
  frameLooking(look) {
    const dir = look ?? (this.walking ? null : this.glanceDir) ?? this.dir;
    if (!this.frames) return (dir === 'left' || (dir !== 'right' && this.facing < 0)) ? this.sprites.left : this.sprites.right;
    if (!this.walking || look) return this.frames[`${dir}Idle`];
    if (this.running) {
      const pass = Math.floor(this.time / RUN_STEP_SECONDS) % 2;
      return this.frames[`${this.dir}${pass ? 'Pass' : 'Stride'}`];
    }
    const step = Math.floor(this.time / STEP_SECONDS) % 2;
    return this.frames[`${this.dir}${step ? 'Step' : 'Idle'}`];
  }

  // Their shadow in the sun (see shadows.js).
  shadow() {
    return this.hidden ? null : { image: this.frame, x: this.x, y: this.y - this.ground };
  }

  draw(ctx, camera) {
    // Hidden, or tucked into a leaf pile with you while the Hush goes over.
    if (this.hidden || this.tucked) return;
    // Playing an animation for a moment (Ves reaching a high lever: see
    // OverworldScene.useLever), drawn in place of her frames.
    if (this.animation) {
      const a = this.animation;
      const frame = animationFrame(a.name, performance.now() / 1000 - a.start, a.speed, true);
      if (frame) {
        drawPosed(ctx, frame, Math.round(this.x) - camera.x, Math.round(this.y) - this.ground - camera.y);
        return;
      }
    }
    const pose = actPose(this.act, now());
    if (this.act && !pose) this.act = null;
    const sprite = this.frameLooking(pose?.look ?? null);
    const off = poseOffset(pose, this.dir);
    // Up on a stepping-stone in the water, keeping their balance (see OverworldScene.balance).
    const sway = this.balancing && !this.walking ? swayAt(this.balanceTime ?? 0) : 0;
    // Members without step frames bob along instead.
    const bob = !this.frames && this.walking && Math.floor(this.time / BOB_SECONDS) % 2 ? 1 : 0;
    const feet = Math.round(this.y) - this.ground - (this.balancing ? STONE_LIFT : 0) + this.sag;
    drawFootShadow(ctx, Math.round(this.x) - camera.x, feet - camera.y);
    drawPosed(ctx, sprite, Math.round(this.x) + sway + off.x - camera.x, feet - bob + off.y - camera.y, pose?.sx ?? 1, pose?.sy ?? 1);
  }
}
