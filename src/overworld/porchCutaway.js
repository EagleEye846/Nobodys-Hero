// A roofed porch you can step into (the Tower Lane's, in Merrow): from outside you see the
// building's front wall with its door; while anyone in the party stands inside the porch, the
// wall (`cover`) fades away to show the floor, and the door arch goes see-through so nobody is
// hidden behind it. Set by a room's `porch: { x, y, w, h, cover, doors }` (tiles, and prop sprite
// names). Only the picture changes: no walking, puzzle or trigger depends on it.
import { TILE_SIZE as T } from '../config.js';

export class PorchCutaway {
  constructor(scene, cfg) {
    this.scene = scene;
    this.cfg = cfg;
    this.cover = 1;
    this.door = 1;
    this.props = scene.room.allProps ?? [];
  }

  inside(who) {
    if (!who || who.hidden) return false;
    const tx = Math.floor((who.x + T / 2) / T);
    const ty = Math.floor((who.y + T / 2) / T);
    const c = this.cfg;
    return tx >= c.x && tx < c.x + c.w && ty >= c.y && ty < c.y + c.h;
  }

  update(dt) {
    const s = this.scene;
    const anyone = this.inside(s.player) || s.followers.some((f) => this.inside(f));
    const k = Math.min(1, dt * 9);
    this.cover += ((anyone ? 0 : 1) - this.cover) * k;
    this.door += ((anyone ? 0.3 : 1) - this.door) * k;
    for (const p of this.props) {
      if (p.look === this.cfg.cover) p.ghostAlpha = this.cover > 0.985 ? null : this.cover;
      else if (this.cfg.doors.includes(p.look)) p.ghostAlpha = this.door > 0.985 ? null : this.door;
    }
  }
}
