import { TILE_SIZE as T } from '../config.js';
import { MEMBERS, memberSprites } from '../characters/party.js';

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

export class Follower {
  constructor(id, x, y) {
    this.id = id;
    this.member = MEMBERS[id];
    this.sprites = memberSprites(id);
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.walking = false;
    this.hidden = false;
    this.time = 0;
    // The hero's recent path, newest last.
    this.trail = [{ x, y }];
  }

  get sortY() {
    return this.y;
  }

  // Put them at a spot, forgetting the path (arriving in a room, or off the rope).
  warpTo(x, y) {
    this.x = x;
    this.y = y;
    this.trail = [{ x, y }];
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
    if (Math.hypot(hero.x - last.x, hero.y - last.y) >= TRAIL_STEP) this.trail.push({ x: hero.x, y: hero.y });
    // Walk back along the path from the hero until we're GAP behind.
    let remaining = GAP;
    let target = this.trail[this.trail.length - 1];
    for (let i = this.trail.length - 1; i > 0 && remaining > 0; i--) {
      const a = this.trail[i];
      const b = this.trail[i - 1];
      const seg = Math.hypot(a.x - b.x, a.y - b.y);
      if (seg >= remaining) {
        const k = remaining / seg;
        target = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
        // Everything before this point is history.
        this.trail.splice(0, i - 1);
        remaining = 0;
      } else {
        remaining -= seg;
        target = b;
      }
    }
    if (this.trail.length > 400) this.trail.splice(0, this.trail.length - 400);
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
    if (Math.abs(dx) > 0.5) this.facing = Math.sign(dx);
  }

  draw(ctx, camera) {
    if (this.hidden) return;
    const sprite = this.facing < 0 ? this.sprites.left : this.sprites.right;
    const x = Math.round(this.x) - Math.floor(sprite.width / 2) - camera.x;
    const bob = this.walking && Math.floor(this.time / BOB_SECONDS) % 2 ? 1 : 0;
    const y = Math.round(this.y) - sprite.height - bob - camera.y;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(Math.round(this.x) - 5 - camera.x, Math.round(this.y) - 3 - camera.y, 10, 3);
    ctx.drawImage(sprite, x, y);
  }
}
