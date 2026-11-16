import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { sfx } from '../audio/music.js';
import { textSection } from '../engine/textLoader.js';
import { inParty } from '../characters/party.js';

// THE ASH ROAD (Chapter 6): ash heaps, Ves's gust, hot cracks, and ash storms.
//
// ASH HEAPS AND THE GUST (the chapter's new puzzle). Soft heaps of ash lie
// across the old road. Face one and press Z and Ves opens her umbrella and
// gives it a gust: the wind runs straight on from the heap, the way you face,
// for up to GUST_TILES tiles, and SCOOPS UP every heap it passes, carrying the
// ash along. Where it crosses a hot crack it drops one heap's worth of ash in
// and the crack is smothered (grey and cool: you can walk on it). Where the
// wind stops (a wall, a rock, someone standing, a doorway, or its full reach)
// all the ash it still carries comes down in one heap, as big as the ash in
// it. Ash is never lost: a big heap (size 2, 3...) fills that many cracks.
// So the puzzle is where to stand, which way to blow, and in what order, to
// clear a way through and to fill the cracks the road crosses.
//
//   props: [{ sprite: 'ar_drift', x: 9, y: 6, heap: 1, text: 'heap' }]   a heap (size 1 to 3)
//          [{ sprite: 'ar_windpost', x: 3, y: 4, ashReset: true, text: 'windpost' }]
//            Z on the wind post: the wind turns and lays every heap back where
//            the room starts it, and the cracks open up again (anyone standing
//            on one is put back at the way in).
//          [{ sprite: 'gold_pouch', x: 9, y: 6, buried: true, gold: 60, ... }]
//            under a heap: not there until the heap has been blown off it.
//
// Ves has to be with you (not off on her own), or be the one you're steering.
// What's blown stays blown: the room remembers its heaps and its smothered
// cracks in the save (WORLD_STATE.ash), so coming back through it, the way
// you made is still there.
//
// ASH STORMS (`ashStorm: { every: 34, lasts: 9 }` on a room). Now and then the
// wind gets up and the ash comes down so thick you can see only a little way
// round you; then it clears. The old road's markers (props with `marker:
// true`, cairns with a red rag) still show through it. When a storm clears,
// every heap that has been blown is laid again where the room started it
// (never on anyone), but cracks already smothered stay smothered.
//
// And everywhere on the Ash Road: ash falling slowly, embers lifting out of
// the cracks, and the cracks glowing (drawn live over the room's picture).

const GUST_TILES = 6;
const GUST_SECONDS = 0.55;
const TEXT = 'interactions/ashroad.txt';
const STORM_RISE = 2.5;
const STORM_FALL = 3;
const STORM_SIGHT = 34;

const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export class AshRoad {
  constructor(scene) {
    this.scene = scene;
    this.room = scene.room;
    this.data = scene.roomData;
    this.time = 0;
    this.gusts = [];
    this.landings = [];
    // The props each data entry made (Room builds allProps from data.props, in order).
    this.heaps = [];
    this.buried = [];
    this.markers = [];
    (this.data.props ?? []).forEach((info, i) => {
      const prop = this.room.allProps[i];
      if (!prop) return;
      if (info.heap) {
        prop.heap = true;
        prop.size = info.heap;
        prop.homeSize = info.heap;
        prop.homeAt = { x: prop.x, y: prop.y };
        prop.baseLook = this.lookFor(info.heap);
        prop.setLook(prop.baseLook);
        this.heaps.push(prop);
      }
      if (info.ashReset) prop.ashReset = true;
      if (info.buried) { prop.buried = true; this.buried.push(prop); }
      if (info.marker) this.markers.push(prop);
    });
    this.cracks = [];
    this.room.tiles.forEach((row, ty) => [...row].forEach((c, tx) => { if (c === '*') this.cracks.push([tx, ty]); }));
    this.storm = this.data.ashStorm ?? null;
    this.restore();
    this.refreshBuried();
  }

  lookFor(size) {
    return size >= 3 ? 'ar_drift_big' : size === 2 ? 'ar_drift_mid' : 'ar_drift';
  }

  // --- The save ---
  get saved() {
    WORLD_STATE.ash ??= {};
    return WORLD_STATE.ash[this.data.id] ?? null;
  }

  remember() {
    WORLD_STATE.ash ??= {};
    const heaps = {};
    for (const h of this.heaps) heaps[h.key] = h.hidden ? 0 : [h.x / T, h.y / T, h.size];
    const smothered = this.cracks.filter(([tx, ty]) => this.room.bridged.has(`${tx},${ty}`)).map(([tx, ty]) => `${tx},${ty}`);
    WORLD_STATE.ash[this.data.id] = { heaps, smothered };
  }

  restore() {
    const saved = this.saved;
    if (!saved) return;
    for (const at of saved.smothered ?? []) this.room.bridged.add(at);
    for (const h of this.heaps) {
      const s = saved.heaps?.[h.key];
      if (s === undefined) continue;
      if (s === 0) { h.hidden = true; h.size = 0; continue; }
      h.moveToTile(s[0], s[1]);
      this.setSize(h, s[2]);
    }
  }

  setSize(heap, size) {
    heap.size = size;
    heap.hidden = size <= 0;
    if (size > 0) heap.setLook(this.lookFor(size));
  }

  // Something buried under a heap shows once no heap sits on its tile.
  refreshBuried() {
    for (const prop of this.buried) {
      const under = this.heaps.some((h) => !h.hidden && h.x === prop.x && h.y === prop.y);
      prop.hidden = under || Boolean(prop.goneForGood);
    }
  }

  isCrack(tx, ty) {
    return this.room.tileAt(tx, ty) === '*' && !this.room.bridged.has(`${tx},${ty}`);
  }

  heapAt(tx, ty) {
    return this.heaps.find((h) => !h.hidden && h.x === tx * T && h.y === ty * T) ?? null;
  }

  // Someone standing on (tx, ty): the one you steer, a friend waiting where you left them, the
  // monsters. (Not the friends trailing behind you: the wind goes round them, and so does the ash.)
  bodyAt(tx, ty) {
    const scene = this.scene;
    const bodies = [scene.player, ...(scene.others ?? []), ...(scene.npcs ?? [])];
    return bodies.some((b) => b && Math.floor(b.x / T) === tx && Math.floor((b.y - 1) / T) === ty);
  }

  // Whether the gust can run on into (tx, ty) (a crack it can always cross: the wind goes over it).
  open(tx, ty) {
    const room = this.room;
    if (this.room.tileAt(tx, ty) === null) return false;
    if (this.isCrack(tx, ty)) return true;
    if (room.isSolidTile(tx, ty) || room.raiseAt(tx, ty) > 0) return false;
    if ((room.doors ?? []).some((d) => tx >= d.x && tx < d.x + (d.w ?? 1) && ty >= d.y && ty < d.y + (d.h ?? 1))) return false;
    const box = [tx * T + 1, ty * T + 1, (tx + 1) * T - 1, (ty + 1) * T - 1];
    if (room.props.some((p) => !p.walkable && !p.heap && !p.hidden && p.overlaps(...box))) return false;
    return !this.bodyAt(tx, ty);
  }

  // Whether Ves can give it a gust from here (and if not, the words for why).
  whyNot() {
    const scene = this.scene;
    if (scene.player.skin === 'vesper') return null;
    if (scene.player.skin === 'bramble') return 'heap_bramble';
    if (!inParty('vesper')) return 'heap_no_ves';
    if (scene.isSplitOff?.('vesper')) return 'heap_ves_away';
    return null;
  }

  // Z on a heap.
  blow(heap) {
    this.blows = (this.blows ?? 0) + 1;
    const why = this.whyNot();
    this.lastWhy = why;
    if (why) {
      this.scene.textbox.open(textSection(TEXT, why), why === 'heap_bramble' ? 'bramble' : null);
      return;
    }
    const [dx, dy] = DIRS[this.scene.player.facing] ?? [0, 1];
    let tx = heap.x / T;
    let ty = heap.y / T;
    // Something right behind it: the ash only packs tighter.
    if (!this.open(tx + dx, ty + dy)) {
      this.lastWhy = `stuck ${tx + dx},${ty + dy}`;
      sfx('push');
      this.scene.textbox.open(textSection(TEXT, 'heap_stuck'));
      return;
    }
    let carried = 0;
    const scooped = [];
    const filled = [];
    const path = [[tx, ty]];
    let steps = 0;
    const take = (x, y) => {
      const h = this.heapAt(x, y);
      if (h) { carried += h.size; scooped.push(h); this.setSize(h, 0); }
    };
    take(tx, ty);
    while (steps < GUST_TILES) {
      const nx = tx + dx;
      const ny = ty + dy;
      if (!this.open(nx, ny)) break;
      tx = nx;
      ty = ny;
      steps++;
      path.push([tx, ty]);
      take(tx, ty);
      if (carried > 0 && this.isCrack(tx, ty)) {
        this.room.bridged.add(`${tx},${ty}`);
        filled.push([tx, ty]);
        carried--;
      }
    }
    // The ash still in the wind comes down where it stops (back a tile if it stopped on a crack it couldn't fill).
    while (carried > 0 && path.length > 1 && this.isCrack(tx, ty)) {
      path.pop();
      [tx, ty] = path[path.length - 1];
    }
    if (carried > 0) {
      const lander = scooped[0];
      lander.moveToTile(tx, ty);
      this.setSize(lander, carried);
      this.landings.push({ heap: lander, t: 0 });
    }
    sfx('whoosh');
    if (filled.length) setTimeout(() => sfx('ember'), 260);
    this.gusts.push({ path, dx, dy, t: 0, filled });
    this.refreshBuried();
    this.remember();
  }

  // The wind post: everything back as the room starts it.
  reset(prop) {
    for (const h of this.heaps) {
      h.moveToTile(h.homeAt.x / T, h.homeAt.y / T);
      this.setSize(h, h.homeSize);
    }
    for (const [tx, ty] of this.cracks) this.room.bridged.delete(`${tx},${ty}`);
    const scene = this.scene;
    const p = scene.player;
    const onCrack = this.isCrack(Math.floor(p.x / T), Math.floor((p.y - 1) / T)) || this.heapAt(Math.floor(p.x / T), Math.floor((p.y - 1) / T));
    if (onCrack) {
      scene.rejoin?.();
      p.x = scene.arrival.x * T + T / 2;
      p.y = (scene.arrival.y + 1) * T;
      p.ground = 0;
    }
    scene.unstick?.();
    for (const f of scene.followers ?? []) f.warpTo(scene.player.x, scene.player.y);
    sfx('whoosh');
    this.refreshBuried();
    this.remember();
    if (prop?.text) scene.textbox.open(textSection(scene.roomData.textFile, `${prop.text}_reset`));
  }

  // For the play harness (tools/preview.html): the heaps and the smothered cracks.
  describe() {
    const heaps = this.heaps.filter((h) => !h.hidden).map((h) => `${h.x / T},${h.y / T}x${h.size}`).join(' ');
    const smothered = this.cracks.filter(([tx, ty]) => this.room.bridged.has(`${tx},${ty}`)).map(([tx, ty]) => `${tx},${ty}`).join(' ');
    return `heaps ${heaps} | smothered ${smothered}${this.storm ? ` | storm ${this.stormLevel().toFixed(2)}` : ''}${this.lastWhy ? ` | said ${this.lastWhy}` : ''} | blows ${this.blows ?? 0}`;
  }

  // --- Storms ---
  stormLevel() {
    if (!this.storm) return 0;
    const every = this.storm.every ?? 34;
    const lasts = this.storm.lasts ?? 9;
    const t = (this.time + (this.storm.offset ?? 0)) % every;
    const start = every - lasts;
    if (t < start) return 0;
    const into = t - start;
    if (into < STORM_RISE) return into / STORM_RISE;
    if (into > lasts - STORM_FALL) return Math.max(0, (lasts - into) / STORM_FALL);
    return 1;
  }

  // When a storm clears, every heap is laid again where the room starts it (and a heap blown
  // somewhere else is gone from there): never onto anyone, and never where a heap already lies.
  relay() {
    let changed = false;
    for (const h of this.heaps) {
      const home = h.homeAt;
      if (!h.hidden && h.x === home.x && h.y === home.y && h.size === h.homeSize) continue;
      if (this.bodyAt(home.x / T, home.y / T)) continue;
      if (this.heaps.some((o) => o !== h && !o.hidden && o.x === home.x && o.y === home.y)) continue;
      h.moveToTile(home.x / T, home.y / T);
      this.setSize(h, h.homeSize);
      changed = true;
    }
    if (changed) { this.refreshBuried(); this.remember(); }
  }

  update(dt) {
    this.time += dt;
    for (const g of this.gusts) g.t += dt;
    this.gusts = this.gusts.filter((g) => g.t < GUST_SECONDS + 0.5);
    for (const l of this.landings) l.t += dt;
    this.landings = this.landings.filter((l) => l.t < GUST_SECONDS + 0.3);
    const level = this.stormLevel();
    if (this.storm && this.lastLevel > 0.5 && level <= 0.5 && level < this.lastLevel) this.relay();
    this.lastLevel = level;
  }

  // --- Drawing ---
  // Smothered cracks: grey ash packed into the split, cooling at the edges.
  drawFloor(ctx) {
    const cam = this.scene.camera;
    for (const [tx, ty] of this.cracks) {
      if (!this.room.bridged.has(`${tx},${ty}`)) continue;
      const x = tx * T - cam.x;
      const y = ty * T - cam.y;
      if (x < -T || y < -T || x > W || y > H) continue;
      // Ash packed into the split: soft grey strokes over it, each row a different length, so it
      // reads as a filled seam and never as a square.
      for (let row = 0; row < T; row++) {
        const left = 2 + Math.floor(hash(tx * 13 + row + ty * 7) * 4);
        const right = T - 2 - Math.floor(hash(tx * 17 + row * 3 + ty) * 4);
        ctx.fillStyle = row % 3 === 0 ? '#9a958e' : row % 3 === 1 ? '#8a8680' : '#7c7873';
        ctx.fillRect(x + left, y + row, right - left, 1);
      }
      // A last red thread at one edge, going out.
      if (hash(tx * 7 + ty) < 0.5) { ctx.fillStyle = '#7a2a10'; ctx.fillRect(x + 2, y + 6 + Math.floor(hash(tx + ty * 3) * 6), 1, 2); }
    }
  }

  // The glow of the open cracks, the gusts, and the ash coming down.
  drawGlow(ctx) {
    const cam = this.scene.camera;
    const t = this.time;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const [tx, ty] of this.cracks) {
      if (this.room.bridged.has(`${tx},${ty}`)) continue;
      const x = tx * T + T / 2 - cam.x;
      const y = ty * T + T / 2 - cam.y;
      if (x < -30 || y < -30 || x > W + 30 || y > H + 30) continue;
      const breathe = 0.65 + 0.35 * Math.sin(t * 1.6 + tx * 0.9 + ty * 1.3);
      const g = ctx.createRadialGradient(x, y, 1, x, y, 15);
      g.addColorStop(0, `rgba(255, 130, 40, ${0.34 * breathe})`);
      g.addColorStop(1, 'rgba(255, 90, 20, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 15, y - 15, 30, 30);
    }
    ctx.restore();
    this.drawEmbers(ctx, cam, t);
    this.drawGusts(ctx, cam);
  }

  drawEmbers(ctx, cam, t) {
    // Out of the cracks: a spark lifts, wavers, goes out.
    const n = this.cracks.length;
    for (let i = 0; i < Math.min(n * 2, 40); i++) {
      const [tx, ty] = this.cracks[i % n];
      if (this.room.bridged.has(`${tx},${ty}`)) continue;
      const period = 3 + hash(i + 5) * 3;
      const life = ((t + hash(i) * period) % period) / period;
      if (life > 0.8) continue;
      const x = tx * T + 3 + hash(i + 11) * 10 + Math.sin(t * 2 + i) * 3 * life - cam.x;
      const y = ty * T + 8 - life * 34 - cam.y;
      ctx.fillStyle = life < 0.4 ? '#ffc060' : life < 0.65 ? '#ff7a2a' : '#8a3010';
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
  }

  drawGusts(ctx, cam) {
    for (const g of this.gusts) {
      const p = Math.min(1, g.t / GUST_SECONDS);
      const fade = g.t > GUST_SECONDS ? Math.max(0, 1 - (g.t - GUST_SECONDS) / 0.5) : 1;
      const [sx, sy] = g.path[0];
      const [ex, ey] = g.path[g.path.length - 1];
      const len = Math.max(1, g.path.length - 1);
      const headX = (sx + (ex - sx) * p) * T + T / 2;
      const headY = (sy + (ey - sy) * p) * T + T / 2;
      // Streaks of wind and puffs of ash running along the path behind the head.
      for (let i = 0; i < 18; i++) {
        const along = hash(i + g.path.length * 3) * p;
        const across = (hash(i + 40) - 0.5) * 12;
        const x = (sx + (ex - sx) * along) * T + T / 2 + (g.dy ? across : 0) - cam.x;
        const y = (sy + (ey - sy) * along) * T + T / 2 + (g.dx ? across : 0) - cam.y;
        ctx.fillStyle = `rgba(214, 208, 198, ${0.55 * fade})`;
        ctx.fillRect(Math.round(x), Math.round(y), g.dx ? 4 : 1, g.dy ? 4 : 1);
        if (i % 3 === 0) {
          ctx.fillStyle = `rgba(150, 144, 136, ${0.5 * fade})`;
          ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
        }
      }
      ctx.fillStyle = `rgba(230, 226, 218, ${0.6 * fade})`;
      ctx.fillRect(Math.round(headX - cam.x) - 2, Math.round(headY - cam.y) - 2, 5, 5);
      // A flash of sparks where a crack was filled.
      for (const [fx, fy] of g.filled) {
        const age = g.t - (Math.abs(fx - sx) + Math.abs(fy - sy)) / len * GUST_SECONDS;
        if (age < 0 || age > 0.6) continue;
        for (let k = 0; k < 6; k++) {
          const a = hash(k + fx * 3 + fy) * Math.PI * 2;
          const r = age * 30;
          ctx.fillStyle = age < 0.3 ? '#ffd070' : '#ff7a2a';
          ctx.fillRect(Math.round(fx * T + T / 2 + Math.cos(a) * r - cam.x), Math.round(fy * T + T / 2 + Math.sin(a) * r * 0.6 - 4 * age * 10 - cam.y), 1, 1);
        }
      }
    }
  }

  // Ash falling (always), and the storm's wall of it with a little sight round you.
  drawOver(ctx) {
    const t = this.time;
    const level = this.stormLevel();
    const wind = 6 + level * 70;
    const count = 46 + Math.round(level * 160);
    for (let i = 0; i < count; i++) {
      const speed = 9 + hash(i) * 10 + level * 30;
      const y = ((hash(i + 100) * (H + 20) + t * speed) % (H + 20)) - 10;
      const x = ((hash(i + 200) * (W + 60) + t * wind + Math.sin(t * 0.8 + i) * 6) % (W + 60)) - 30;
      const big = hash(i + 300) < 0.25;
      ctx.fillStyle = big ? 'rgba(206, 202, 194, 0.75)' : 'rgba(170, 166, 160, 0.6)';
      ctx.fillRect(Math.round(x), Math.round(y), big ? 2 : 1, 1);
    }
    if (level <= 0) return;
    const cam = this.scene.camera;
    const px = this.scene.player.x - cam.x;
    const py = this.scene.player.y - 8 - cam.y;
    const sight = STORM_SIGHT + (1 - level) * 160;
    const g = ctx.createRadialGradient(px, py, sight * 0.45, px, py, sight);
    const thick = 0.9 * level;
    g.addColorStop(0, 'rgba(120, 116, 110, 0)');
    g.addColorStop(1, `rgba(120, 116, 110, ${thick})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // Streaks of driven ash across the whole view.
    for (let i = 0; i < 70; i++) {
      const y = (hash(i + 500) * H + Math.sin(t + i) * 4) | 0;
      const x = ((hash(i + 600) * (W + 80) + t * (180 + hash(i + 700) * 120)) % (W + 80)) - 40;
      ctx.fillStyle = `rgba(190, 186, 180, ${0.35 * level})`;
      ctx.fillRect(Math.round(x), y, 6 + Math.round(hash(i + 800) * 8), 1);
    }
    // The road's markers still show through it.
    for (const m of this.markers) {
      if (m.hidden) continue;
      ctx.save();
      ctx.globalAlpha = Math.min(1, 0.4 + 0.6 * level);
      m.draw(ctx, cam);
      ctx.restore();
    }
  }
}

// A room on the Ash Road gets this (anywhere else, nothing).
export function makeAshRoad(scene) {
  return scene.roomData.area === 'ashroad' ? new AshRoad(scene) : null;
}
