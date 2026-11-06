import { TILE_SIZE as T } from '../config.js';
import { TILES } from './tileset.js';

// THE SWEEPING LAMPS (Chapter 5: the Beacon Isles and the Last Light).
//
// A lighthouse lamp whose beam goes round, or back and forth, on a timer.
// If the beam touches anyone in the party you've been seen: a soft white
// flash and you're back at the last safe stop (or the door you came in by),
// everyone together again. Nothing hurts. Walls, solid props, pillars and
// raised blocks cast shadows the beam can't get into: that's where you wait.
//
// A room's `lamps` field is a list of:
//   { x, y,            the lamp's tile (the lamp is drawn on it; put it on a
//                      wall, pillar or a solid prop's tile so nobody walks into it)
//     speed: 40,       degrees a second (negative goes the other way round)
//     arc: [a, b],     sweep back and forth between those two angles instead
//                      of going all the way round
//     pause: 0.6,      seconds it rests at each end of an arc
//     start: 0,        the angle it starts at
//     spread: 24,      how wide the beam is, in degrees
//     range: 7,        how far it reaches, in tiles
//     off: 'name',     a switch (lever, plate, eye...) that puts the lamp out while it's on
//                      (or a list of names: any one of them on puts it out)
//     art: false,      don't draw the little iron lamp (the room has a prop there)
//                      ('lens': just a glow on the prop's lantern glass, gone while it's off)
//   }
// Angles are in degrees: 0 points right (east), 90 down (south), 180 left, 270 up.
// `lampSafe: [{ x, y, w, h }]` are zones (tiles): the last one you stood in is
// where you come back to. `lampText: { first, again }` are sections of the
// room's text file said (by Ves, if she's with you) on being sent back.

const STEP = 3;
const OVER = new Set(['~', '$', '_']);
// The beam's eye-height above the floor, in pixels: where it meets a body.
const CHEST = 6;
const RAY_EVERY = 3;
const rad = (d) => (d * Math.PI) / 180;

export class LampField {
  constructor(scene) {
    this.scene = scene;
    this.room = scene.room;
    this.data = scene.roomData.lamps ?? [];
    this.lamps = this.data.map((d) => ({
      d,
      x: d.x * T + T / 2,
      y: d.y * T + T / 2 - 2,
      speed: d.speed ?? 40,
      spread: d.spread ?? 24,
      range: (d.range ?? 7) * T,
      pause: d.pause ?? 0.6,
    }));
    this.over = new Set([...OVER, ...(scene.roomData.beamOver ?? '')]);
    this.t = 0;
  }

  get active() {
    return this.lamps.length > 0;
  }

  // `off` may be one switch name or a list (any one of them on puts the lamp out).
  isOff(lamp) {
    if (!lamp.d.off) return false;
    return [].concat(lamp.d.off).some((name) => this.room.isLeverOn(name));
  }

  // The way a lamp points `t` seconds in, in degrees.
  angle(lamp, t = this.t) {
    const { d } = lamp;
    if (!d.arc) return (d.start ?? 0) + lamp.speed * t;
    const [a, b] = d.arc;
    const span = Math.abs(b - a);
    const travel = span / Math.abs(lamp.speed || 1);
    const ahead = ((d.start ?? a) - a) / (b - a || 1) * travel;
    const cycle = 2 * (travel + lamp.pause);
    const u = (((t + ahead) % cycle) + cycle) % cycle;
    let k = 0;
    if (u < travel) k = u / travel;
    else if (u < travel + lamp.pause) k = 1;
    else if (u < 2 * travel + lamp.pause) k = 1 - (u - travel - lamp.pause) / travel;
    return a + (b - a) * k;
  }

  update(dt) {
    this.t += dt;
  }

  // Whether the beam's way is shut at a point: a wall, a raised block or a
  // solid prop. (Within a tile of the lamp nothing is, so it can sit in a wall.)
  blocked(lamp, px, py) {
    const tx = Math.floor(px / T);
    const ty = Math.floor(py / T);
    // Nothing blocks right at the lamp itself: it can sit in a wall or on a pillar.
    if (Math.hypot(px - lamp.x, py - lamp.y) < T || (tx === lamp.d.x && ty === lamp.d.y)) return false;
    const tile = this.room.tileAt(tx, ty);
    if (tile === null) return true;
    if (this.room.isSolidTile(tx, ty) && !this.over.has(tile) && !TILES[tile]?.beamOver) return true;
    if (this.room.raiseAt(tx, ty) > 0) return true;
    return this.room.props.some((p) => !p.hidden && this.room.propBlocks(p, px, py, px + 1, py + 1));
  }

  // How far a ray at an angle goes before it's stopped.
  reach(lamp, deg) {
    const c = Math.cos(rad(deg));
    const s = Math.sin(rad(deg));
    let r = 0;
    while (r < lamp.range) {
      r += STEP;
      if (this.blocked(lamp, lamp.x + c * r, lamp.y + s * r)) return r - STEP;
    }
    return lamp.range;
  }

  // The shape of the lit wedge: the lamp, then a point out along each ray.
  shape(lamp) {
    const mid = this.angle(lamp);
    const rays = Math.max(2, Math.ceil(lamp.spread / RAY_EVERY) + 1);
    const points = [];
    for (let i = 0; i < rays; i++) {
      const deg = mid - lamp.spread / 2 + (lamp.spread * i) / (rays - 1);
      const r = this.reach(lamp, deg);
      points.push({ x: lamp.x + Math.cos(rad(deg)) * r, y: lamp.y + Math.sin(rad(deg)) * r, r, deg });
    }
    return { mid, points };
  }

  // Whether the beam is on a body (feet at x, y) right now.
  touches(lamp, body) {
    if (this.isOff(lamp)) return false;
    const dx = body.x - lamp.x;
    const dy = body.y - CHEST - lamp.y;
    const dist = Math.hypot(dx, dy);
    if (dist > lamp.range + 4) return false;
    const mid = this.angle(lamp);
    // How far round from the middle of the beam they are, with a little for their width.
    let off = ((Math.atan2(dy, dx) * 180) / Math.PI - mid) % 360;
    if (off > 180) off -= 360;
    if (off < -180) off += 360;
    const slack = dist > 1 ? (Math.atan(5 / dist) * 180) / Math.PI : 180;
    if (Math.abs(off) > lamp.spread / 2 + slack * 0.4) return false;
    // Nothing between: walk along from the lamp, not counting their own tile.
    const bx = Math.floor(body.x / T);
    const by = Math.floor((body.y - 1) / T);
    for (let r = STEP; r < dist; r += STEP) {
      const px = lamp.x + (dx / dist) * r;
      const py = lamp.y + (dy / dist) * r;
      if (Math.floor(px / T) === bx && Math.floor(py / T) === by) break;
      if (this.blocked(lamp, px, py)) return false;
    }
    return true;
  }

  // The lamp that has any of these bodies in its beam, or null.
  seen(bodies) {
    for (const lamp of this.lamps) {
      if (bodies.some((b) => !b.hidden && !b.tucked && Number.isFinite(b.x) && this.touches(lamp, b))) return lamp;
    }
    return null;
  }

  // The beams: a soft warm wedge that's brighter at the lamp, with a firmer edge.
  draw(ctx, camera, time = 0) {
    for (const lamp of this.lamps) {
      const lx = Math.round(lamp.x - camera.x);
      const ly = Math.round(lamp.y - camera.y);
      const off = this.isOff(lamp);
      if (!off) {
        const { points } = this.shape(lamp);
        const flicker = 0.92 + Math.sin(time * 9 + lamp.d.x) * 0.04;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        for (const p of points) ctx.lineTo(Math.round(p.x - camera.x), Math.round(p.y - camera.y));
        ctx.closePath();
        const grad = ctx.createRadialGradient(lx, ly, 2, lx, ly, lamp.range);
        grad.addColorStop(0, `rgba(255, 244, 190, ${(0.5 * flicker).toFixed(3)})`);
        grad.addColorStop(1, `rgba(255, 232, 150, ${(0.17 * flicker).toFixed(3)})`);
        ctx.fillStyle = grad;
        ctx.fill();
        // The two edges, so it reads as a beam and not a stain.
        ctx.strokeStyle = 'rgba(255, 248, 210, 0.38)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(Math.round(points[0].x - camera.x) + 0.5, Math.round(points[0].y - camera.y) + 0.5);
        ctx.lineTo(lx + 0.5, ly + 0.5);
        const last = points[points.length - 1];
        ctx.lineTo(Math.round(last.x - camera.x) + 0.5, Math.round(last.y - camera.y) + 0.5);
        ctx.stroke();
        ctx.restore();
      }
      this.drawLamp(ctx, lamp, lx, ly, off, time);
    }
  }

  // The lamp itself: a squat iron post with its lens on top (unless the room
  // gives it art of its own with `art: false` and a prop on the tile).
  drawLamp(ctx, lamp, lx, ly, off, time) {
    if (lamp.d.art === false) return;
    // 'lens': the room's own lighthouse prop has the lantern; just light its glass (nothing when off).
    if (lamp.d.art === 'lens') {
      if (off) return;
      const pulse = 0.85 + Math.sin(time * 5 + lamp.d.x) * 0.1;
      ctx.fillStyle = `rgba(255, 236, 160, ${(0.28 * pulse).toFixed(3)})`;
      ctx.fillRect(lx - 9, ly - 8, 18, 15);
      ctx.fillStyle = `rgba(255, 226, 130, ${(0.85 * pulse).toFixed(3)})`;
      ctx.fillRect(lx - 5, ly - 5, 10, 10);
      ctx.fillStyle = '#fff8dc';
      ctx.fillRect(lx - 2, ly - 3, 4, 6);
      return;
    }
    const baseY = Math.round(lamp.d.y * T + T - this.scene.camera.y);
    ctx.fillStyle = '#2c2a36';
    ctx.fillRect(lx - 4, baseY - 8, 8, 8);
    ctx.fillStyle = '#4a4658';
    ctx.fillRect(lx - 4, baseY - 8, 8, 2);
    ctx.fillRect(lx - 1, baseY - 11, 2, 3);
    ctx.fillStyle = '#1a1822';
    ctx.fillRect(lx - 4, ly - 6, 8, 6);
    ctx.fillStyle = off ? '#6a6a78' : '#fff6c8';
    ctx.fillRect(lx - 3, ly - 5, 6, 4);
    if (!off) {
      ctx.fillStyle = `rgba(255, 244, 190, ${(0.35 + Math.sin(time * 6) * 0.08).toFixed(3)})`;
      ctx.fillRect(lx - 5, ly - 7, 10, 8);
    }
  }
}
