import { TILE_SIZE as T } from '../config.js';
import { MEMBERS, memberSprites, memberFrames } from '../characters/party.js';

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
// Faster than this (pixels a second) and they're running to keep up.
const RUN_PACE = 85;

export class Follower {
  constructor(id, x, y) {
    this.id = id;
    this.member = MEMBERS[id];
    this.sprites = memberSprites(id);
    this.frames = memberFrames(id);
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

  update(dt, hero) {
    this.time += dt;
    const last = this.trail[this.trail.length - 1];
    if (Math.hypot(hero.x - last.x, hero.y - last.y) >= TRAIL_STEP) this.trail.push({ x: hero.x, y: hero.y, ground: hero.ground });
    // Walk back along the path from the hero until we're GAP behind.
    let remaining = GAP;
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
      this.walking = distance > 0.5;
    } else {
      this.x += (dx / distance) * pace;
      this.y += (dy / distance) * pace;
      this.walking = true;
    }
    this.running = this.walking && (hero.running || pace / dt > RUN_PACE);
    if (Math.abs(dx) > 0.5) this.facing = Math.sign(dx);
    if (distance > 0.5) this.dir = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  }

  // The frame to show: with walking frames, the way they're heading, stepping
  // or running; otherwise their one sprite, turned left or right.
  get frame() {
    if (!this.frames) return this.facing < 0 ? this.sprites.left : this.sprites.right;
    if (!this.walking) return this.frames[`${this.dir}Idle`];
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
    if (this.hidden) return;
    const sprite = this.frame;
    const x = Math.round(this.x) - Math.floor(sprite.width / 2) - camera.x;
    // Members without step frames bob along instead.
    const bob = !this.frames && this.walking && Math.floor(this.time / BOB_SECONDS) % 2 ? 1 : 0;
    const feet = Math.round(this.y) - this.ground;
    const y = feet - sprite.height - bob - camera.y;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(Math.round(this.x) - 5 - camera.x, feet - 3 - camera.y, 10, 3);
    ctx.drawImage(sprite, x, y);
  }
}
