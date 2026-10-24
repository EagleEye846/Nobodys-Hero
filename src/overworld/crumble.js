import { TILE_SIZE as T } from '../config.js';
import { sfx } from '../audio/music.js';
import { textFile } from '../engine/textLoader.js';

// CRUMBLING FLOORS (the Dead City, Chapter 3). A `!` tile is a flagstone
// split right through, with nothing much under it. Step on one and it
// starts to go: it creaks, cracks spread across it, dust rises from the
// joints, and about half a second later it drops away in chunks, leaving a
// hole for the rest of your visit (the floor's whole again next time you
// come in). When one goes, its neighbours of the same kind start going too,
// so a run of them collapses behind you like a wave: keep moving and you
// outpace it; stop and it catches you. Land on one from a jump and it goes
// almost at once.
//
// If you're standing on one when it goes, you fall, and that's a game over
// (or, over a `drop`, the way down to somewhere). Holes don't stop you
// walking into them: at floor level, that's a fall too; but a jump clears a
// one-tile hole. Ves, on her crutch, won't put a foot on any of it: steer
// her onto a `!` tile or a hole and she steps straight back off, so lay
// her `planks` (she's light, and planks are planks). Followers walk where
// you walked and come to no harm.
//
// A room's `crumble` tunes it:
//   crumble: {
//     delay: 0.6,     seconds from the first step to the fall
//     spread: 0.3,    seconds for a fall to take each neighbour (0: it doesn't)
//     planks: [{ x, y, w, h, lever }],  boards over those tiles (while the
//                     lever's on, if it names one): they hold, and bridge holes
//     drops: [{ x, y, w, h, to, spawn }],  fall through these and you land in
//                     room `to` at `spawn`, instead of a game over
//   }

const DELAY = 0.6;
const SPREAD = 0.3;
// Landing on one from a jump: it goes this soon.
const LANDING = 0.25;
// How long the fall is watched before the screen fades (the overworld's
// own FALL_SECONDS: the fade starts then, and over a drop, the next room).
const FALL_SECONDS = 0.9;
const CHUNK_GRAVITY = 320;
const DUST_LIFE = 0.5;
const FELL = 'The old floor gave way beneath you.';
const TILE = '!';
// The flagstones' own stone, for the chunks (see drawRuinedFloor in tileset.js).
const STONE = ['#3a3160', '#4a4078', '#2a2448', '#413869', '#5a4e8c'];

// The crumbling floor of a room, or null if it has none.
export function crumbleIn(roomData, room) {
  if (!roomData.tiles.some((row) => row.includes(TILE))) return null;
  return new Crumble(roomData, room);
}

export class Crumble {
  constructor(roomData, room) {
    const options = roomData.crumble ?? {};
    this.room = room;
    this.delay = options.delay ?? DELAY;
    this.spread = options.spread ?? SPREAD;
    this.planks = options.planks ?? [];
    this.drops = options.drops ?? [];
    // Each tile's state, keyed "tx,ty": { tx, ty, left, total } while it's
    // going (seconds `left` of `total`), or 'gone' once it has.
    this.state = new Map();
    this.chunks = [];
    this.dust = [];
    this.time = 0;
    // Whoever's going down a hole right now (see fall).
    this.falling = null;
    // Where Ves last stood on floor she'll stand on, to put her back to.
    this.safe = null;
    this.saidNo = false;
  }

  key(tx, ty) {
    return `${tx},${ty}`;
  }

  isCrumbling(tx, ty) {
    return this.room.tileAt(tx, ty) === TILE;
  }

  isHole(tx, ty) {
    return this.state.get(this.key(tx, ty)) === 'gone';
  }

  // Boards over (tx, ty) right now: a `planks` span that covers it, with its
  // lever on (or no lever to pull).
  planked(tx, ty) {
    return this.planks.some((p) => tx >= p.x && tx < p.x + (p.w ?? 1) && ty >= p.y && ty < p.y + (p.h ?? 1)
      && (!p.lever || this.room.isLeverOn(p.lever)));
  }

  dropAt(tx, ty) {
    return this.drops.find((d) => tx >= d.x && tx < d.x + (d.w ?? 1) && ty >= d.y && ty < d.y + (d.h ?? 1)) ?? null;
  }

  // Floor that won't hold: a `!` tile that's whole or going, not boarded over.
  unsafe(tx, ty) {
    return this.isCrumbling(tx, ty) && !this.planked(tx, ty);
  }

  // Starts (tx, ty) going, in `seconds`; one already going goes sooner if
  // `seconds` is less than it has left.
  crack(tx, ty, seconds) {
    if (!this.unsafe(tx, ty)) return;
    const key = this.key(tx, ty);
    const was = this.state.get(key);
    if (was === 'gone') return;
    if (was) {
      if (seconds < was.left) was.left = seconds;
      return;
    }
    this.state.set(key, { tx, ty, left: seconds, total: seconds });
    sfx('creak');
    this.puff(tx, ty, 3);
  }

  // Dust rising from the joints of a tile.
  puff(tx, ty, count) {
    for (let i = 0; i < count; i++) {
      const side = Math.floor(Math.random() * 4);
      const along = 2 + Math.random() * (T - 4);
      const x = tx * T + (side === 0 ? along : side === 1 ? T - 1 : side === 2 ? along : 1);
      const y = ty * T + (side === 0 ? 1 : side === 1 ? along : side === 2 ? T - 1 : along);
      this.dust.push({ x, y, vx: (Math.random() - 0.5) * 10, vy: -8 - Math.random() * 10, t: 0, life: DUST_LIFE * (0.7 + Math.random() * 0.6) });
    }
  }

  // The tile goes: a hole now, its stone tumbling into the dark, and its
  // neighbours of the same kind start going after it.
  give(scene, tile) {
    const { tx, ty } = tile;
    this.state.set(this.key(tx, ty), 'gone');
    sfx('crumble');
    scene.shakeCamera(1, 0.14);
    this.puff(tx, ty, 6);
    for (let i = 0; i < 8; i++) {
      this.chunks.push({
        x: tx * T + 2 + Math.random() * (T - 5), y: ty * T + 2 + Math.random() * (T - 5), z: 0,
        vx: (Math.random() - 0.5) * 26, vy: (Math.random() - 0.5) * 12, vz: 18 + Math.random() * 44,
        size: 2 + Math.floor(Math.random() * 2), color: STONE[Math.floor(Math.random() * STONE.length)], t: 0,
      });
    }
    if (this.spread > 0) {
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) this.crack(tx + dx, ty + dy, this.spread);
    }
    // You, if you're standing on it (at floor level, not mid-jump).
    const who = scene.player;
    if (who === scene.heroBody && !who.isFalling && who.ground === 0 && !who.isAirborne) {
      const [px, py] = who.tilePosition();
      if (px === tx && py === ty) this.fall(scene, who, tx, ty);
    }
  }

  // Down you go: the game's own fall (it freezes you, fades the screen and
  // ends in a game over), drawn here instead, spinning and shrinking into
  // the dark; or, over a drop, down into the room below.
  fall(scene, who, tx, ty) {
    const drop = this.dropAt(tx, ty);
    const frame = who.currentFrame();
    who.fallInto(tx, ty);
    who.hidden = true;
    who.fallMessage = drop ? null : FELL;
    this.falling = { who, frame, x: tx * T + T / 2, y: (ty + 1) * T, t: 0, drop, spin: Math.random() < 0.5 ? 1 : -1 };
    sfx('crumble');
    scene.shakeCamera(2, 0.25);
    this.puff(tx, ty, 8);
  }

  // Nothing gives while something else has the room (a cutscene, a menu,
  // words on screen, a fight starting, the dark after a fall): the floor
  // waits for you.
  busy(scene) {
    return Boolean(scene.cutscene || scene.textbox.isOpen || scene.pauseMenu.isOpen || scene.storageMenu.isOpen
      || scene.travelMenu.isOpen || scene.battleFlash || scene.caught || scene.ride || scene.hop || scene.climb
      || scene.resting || scene.doorway || scene.fadeIn > 0);
  }

  update(dt, scene) {
    this.time += dt;
    this.updateBits(dt);
    if (this.falling) {
      this.falling.t += dt;
      const { drop } = this.falling;
      // Through a drop: once you're out of sight, the room below.
      if (drop && this.falling.t >= FALL_SECONDS && !scene.doorway) {
        scene.doorway = { door: { to: drop.to, spawn: drop.spawn }, t: 0 };
      }
      return;
    }
    if (this.busy(scene)) return;
    const who = scene.player;
    if (who.isFalling) return;
    // Tiles with somebody standing still on them (the one of you who isn't
    // being steered) hold, till they're off.
    const held = new Set();
    if (scene.partner) held.add(this.key(...scene.partner.tilePosition()));

    // The ones going, going.
    for (const tile of [...this.state.values()]) {
      if (tile === 'gone' || held.has(this.key(tile.tx, tile.ty))) continue;
      tile.left -= dt;
      // Halfway there, it shudders.
      if (tile.left < tile.total / 2 && !tile.shook) {
        tile.shook = true;
        this.puff(tile.tx, tile.ty, 2);
      }
      if (tile.left <= 0) this.give(scene, tile);
    }
    if (this.falling) return;

    const [tx, ty] = who.tilePosition();
    const onFloor = who.ground === 0 && !who.isAirborne;
    if (who === scene.heroBody) {
      if (!onFloor) return;
      if (this.isHole(tx, ty) && !this.planked(tx, ty)) {
        this.fall(scene, who, tx, ty);
      } else if (this.unsafe(tx, ty)) {
        this.crack(tx, ty, who.landedThisFrame ? LANDING : this.delay);
      }
      return;
    }
    // Steering Ves: she won't have it. Back to where she last stood.
    if (!onFloor) return;
    if (this.unsafe(tx, ty) || this.isHole(tx, ty)) {
      if (this.safe) {
        who.x = this.safe.x;
        who.y = this.safe.y;
        who.remainderX = 0;
        who.remainderY = 0;
      }
      // (Once, not every frame you keep pushing her at it.)
      if (this.time - (this.balkedAt ?? -1) > 0.5) sfx('back');
      this.balkedAt = this.time;
      // (Her words, if the room's text has them: [cracked_floor_no].)
      if (!this.saidNo) {
        this.saidNo = true;
        const file = scene.roomData.textFile;
        if (file && textFile(file)?.cracked_floor_no) scene.say(file, 'cracked_floor_no', 'vesper');
      }
      return;
    }
    this.safe = { x: who.x, y: who.y };
  }

  // The dust and the falling stone.
  updateBits(dt) {
    for (const puff of this.dust) {
      puff.t += dt;
      puff.x += puff.vx * dt;
      puff.y += puff.vy * dt;
      puff.vy *= 0.9;
    }
    this.dust = this.dust.filter((puff) => puff.t < puff.life);
    for (const chunk of this.chunks) {
      chunk.t += dt;
      chunk.x += chunk.vx * dt;
      chunk.y += chunk.vy * dt;
      chunk.z += chunk.vz * dt;
      chunk.vz -= CHUNK_GRAVITY * dt;
    }
    // Gone once they've dropped out of sight down the hole.
    this.chunks = this.chunks.filter((chunk) => chunk.z > -T * 2);
  }

  // --- Drawing. The floor's part goes under everyone's feet; the dust,
  // the stone and whoever's falling go over. ---

  drawFloor(ctx, camera) {
    for (const tile of this.state.values()) {
      if (tile === 'gone') continue;
      this.drawCracking(ctx, camera, tile);
    }
    for (const [key, tile] of this.state) {
      if (tile !== 'gone') continue;
      const [tx, ty] = key.split(',').map(Number);
      this.drawHole(ctx, tx * T - camera.x, ty * T - camera.y, tx, ty);
    }
    this.drawPlanks(ctx, camera);
  }

  // A tile on its way: the slab itself shudders (drawn again off its spot),
  // and cracks reach out from its middle as it goes.
  drawCracking(ctx, camera, tile) {
    const gone = 1 - tile.left / tile.total;
    const sx = tile.tx * T;
    const sy = tile.ty * T;
    const x = sx - camera.x;
    const y = sy - camera.y;
    const shake = gone > 0.45 ? Math.round(Math.sin(this.time * 70) * (gone > 0.8 ? 1.5 : 1)) : 0;
    const sink = gone > 0.7 ? 1 : 0;
    if (shake || sink) {
      ctx.fillStyle = '#120c1c';
      ctx.fillRect(x, y, T, T);
      ctx.drawImage(this.room.background, sx, sy, T, T, x + shake, y + sink, T, T);
    }
    // Cracks, more of them the further gone it is.
    const reach = Math.min(1, gone * 1.4);
    ctx.fillStyle = '#120c1c';
    const arms = [[1, 0.6], [-1, 0.4], [0.5, -1], [-0.7, -0.8], [0.9, 1], [-1, 1]];
    arms.forEach(([ax, ay], i) => {
      if (reach * arms.length < i) return;
      const length = 2 + Math.floor(reach * 6);
      let cx = 7;
      let cy = 7;
      for (let k = 0; k < length; k++) {
        cx += ax + (((k * 7 + i * 3) % 3) - 1) * 0.5;
        cy += ay + (((k * 5 + i) % 3) - 1) * 0.5;
        const px = Math.max(0, Math.min(T - 1, Math.round(cx)));
        const py = Math.max(0, Math.min(T - 1, Math.round(cy)));
        ctx.fillRect(x + px + shake, y + py + sink, 1, 1);
        if (k % 3 === 1) {
          ctx.fillStyle = '#4a4078';
          ctx.fillRect(x + px + 1 + shake, y + py + sink, 1, 1);
          ctx.fillStyle = '#120c1c';
        }
      }
    });
  }

  // A hole where a flagstone was: the dark, the far wall of it lit a little
  // so it reads as deep, and the broken edges of the slabs round it.
  drawHole(ctx, x, y, tx, ty) {
    ctx.fillStyle = '#05030a';
    ctx.fillRect(x + 1, y + 1, T - 2, T - 1);
    ctx.fillRect(x, y + 2, T, T - 3);
    ctx.fillStyle = '#1c1636';
    ctx.fillRect(x + 2, y + 2, T - 4, 2);
    ctx.fillStyle = '#110c22';
    ctx.fillRect(x + 3, y + 4, T - 6, 1);
    // The rim: a lit edge on top, and ragged bits of slab left sticking out.
    ctx.fillStyle = '#4a4078';
    ctx.fillRect(x + 1, y, T - 2, 1);
    const bits = [[0, 5, 2, 1], [T - 2, 9, 2, 1], [4, T - 1, 3, 1], [T - 5, T - 2, 2, 2], [0, 12, 1, 2]];
    ctx.fillStyle = '#2a2448';
    bits.forEach(([bx, by, w, h], i) => {
      if ((tx * 3 + ty * 5 + i) % 3 === 0) return;
      ctx.fillRect(x + bx, y + by, w, h);
    });
  }

  // Boards laid over the broken floor: pale, worn planks side by side,
  // with a nail-head or two and a shadow under their ends.
  drawPlanks(ctx, camera) {
    for (const span of this.planks) {
      if (span.lever && !this.room.isLeverOn(span.lever)) continue;
      const w = span.w ?? 1;
      const h = span.h ?? 1;
      const across = w >= h;
      for (let ty = span.y; ty < span.y + h; ty++) {
        for (let tx = span.x; tx < span.x + w; tx++) {
          const x = tx * T - camera.x;
          const y = ty * T - camera.y;
          ctx.fillStyle = 'rgba(4, 2, 10, 0.45)';
          ctx.fillRect(x, y, T, T);
          for (let i = 0; i < 3; i++) {
            const shade = (tx + ty + i) % 2 ? '#6e5a3c' : '#7c6644';
            ctx.fillStyle = shade;
            if (across) ctx.fillRect(x, y + 1 + i * 5, T, 4);
            else ctx.fillRect(x + 1 + i * 5, y, 4, T);
            ctx.fillStyle = '#8c7650';
            if (across) ctx.fillRect(x, y + 1 + i * 5, T, 1);
            else ctx.fillRect(x + 1 + i * 5, y, 1, T);
            ctx.fillStyle = '#4a3a24';
            if (across) ctx.fillRect(x, y + 4 + i * 5, T, 1);
            else ctx.fillRect(x + 4 + i * 5, y, 1, T);
          }
          if ((tx * 7 + ty * 3) % 4 === 0) {
            ctx.fillStyle = '#2a2018';
            ctx.fillRect(x + 3 + ((tx + ty) % 5), y + 2 + ((tx * ty) % 9), 1, 1);
          }
        }
      }
    }
  }

  draw(ctx, camera) {
    for (const chunk of this.chunks) {
      const x = Math.round(chunk.x - camera.x);
      const y = Math.round(chunk.y - chunk.z - camera.y);
      ctx.save();
      if (chunk.z < 0) {
        // Down the hole: only seen inside it, dimmer the deeper it goes.
        const hx = Math.floor(chunk.x / T) * T - camera.x;
        const hy = Math.floor(chunk.y / T) * T - camera.y;
        ctx.beginPath();
        ctx.rect(hx, hy, T, T);
        ctx.clip();
        ctx.globalAlpha = Math.max(0, 1 + chunk.z / (T * 1.6));
      }
      ctx.fillStyle = chunk.color;
      ctx.fillRect(x, y, chunk.size, chunk.size);
      ctx.fillStyle = '#1e1838';
      ctx.fillRect(x, y + chunk.size - 1, chunk.size, 1);
      ctx.restore();
    }
    for (const puff of this.dust) {
      ctx.globalAlpha = 0.7 * (1 - puff.t / puff.life);
      ctx.fillStyle = '#8a80a8';
      ctx.fillRect(Math.round(puff.x - camera.x), Math.round(puff.y - camera.y), 1, 1);
    }
    ctx.globalAlpha = 1;
    if (this.falling) this.drawFalling(ctx, camera);
  }

  // Going down: smaller and smaller, turning over, into the dark, seen only
  // above the hole's near edge and inside the hole.
  drawFalling(ctx, camera) {
    const { frame, x, y, t, spin } = this.falling;
    const k = Math.min(1, t / FALL_SECONDS);
    const scale = Math.max(0.15, 1 - k * 0.85);
    const drop = 8 * k * k;
    const hx = x - T / 2 - camera.x;
    const hy = y - T - camera.y;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, hy + T - 2);
    ctx.clip();
    ctx.globalAlpha = 1 - k * 0.5;
    ctx.translate(x - camera.x, y - frame.height / 2 - camera.y + drop);
    ctx.rotate(spin * k * k * Math.PI * 2.5);
    ctx.scale(scale, scale);
    ctx.drawImage(frame, -frame.width / 2, -frame.height / 2);
    ctx.restore();
  }
}
