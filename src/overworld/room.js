import { TILE_SIZE as T } from '../config.js';
import { TILES, floorUnder, drawDrops } from './tileset.js';
import { standingPicture } from './shadows.js';
import { Prop } from './prop.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { inParty } from '../characters/party.js';
import { isLamplit, PROP_GLOWS } from './lamplight.js';

// Crack pixels as [x, y, width, height] within a tile. Each crack level shows more of the list.
const CRACKS = [
  [7, 4, 1, 3], [8, 7, 1, 2], [9, 9, 2, 1], [6, 7, 1, 1], [5, 8, 1, 2],
  [11, 10, 1, 3], [3, 10, 2, 1], [2, 11, 1, 2], [10, 3, 2, 1], [12, 2, 1, 1], [7, 11, 1, 3],
];
const CRACK_RECTS_PER_LEVEL = [0, 5, CRACKS.length];
const MAX_CRACKS = CRACK_RECTS_PER_LEVEL.length - 1;

function drawHole(ctx, x, y) {
  ctx.fillStyle = '#05030a';
  ctx.fillRect(x + 1, y + 2, T - 2, T - 3);
  ctx.fillRect(x + 2, y + 1, T - 4, T - 1);
  // The far wall of the pit, lit slightly so the hole reads as deep.
  ctx.fillStyle = '#1c1636';
  ctx.fillRect(x + 2, y + 2, T - 4, 2);
}

// Whether a prop is in the room right now. Props can come and go with the
// story: `until` a cutscene has played (Taper waters her flowers until you meet
// her), or only `after` one has (then she's at home).
function showsUpNow({ until = null, after = null, join = null }) {
  const seen = WORLD_STATE.seenScenes ?? [];
  if (until && seen.includes(until)) return false;
  if (after && !seen.includes(after)) return false;
  // Someone who's joined the party is with you, not here.
  if (join && inParty(join)) return false;
  return true;
}

// Objects that give off light: [radius in pixels, strength].
const PROP_LIGHTS = {
  fireplace: [56, 0.26],
  lamp: [30, 0.14],
  side_table: [24, 0.12],
  table: [26, 0.1],
  counter_cake: [18, 0.08],
  lantern_post_on: [26, 0.12],
  campfire: [40, 0.2],
  brazier: [34, 0.18],
  stove_pot: [22, 0.1],
  street_lamp: [34, 0.14],
};

// How far light reaches in a dark room (`dark`, see overworldScene.js), for
// lantern pillars and candle stands; props use PROP_LIGHTS, or their own `light`.
const DARK_TILE_LIGHTS = { P: 64, C: 56, x: 46, w: 40 };

export class Room {
  constructor(data) {
    this.tiles = data.tiles;
    // The region it's in (src/data/areas.js); outdoor regions floor their
    // hidden corners with grass instead of Ruins stone.
    this.area = data.area;
    // A spire room is the outside of a round mountain: its left and right
    // edges join up, so walking off one side brings you round to the other.
    this.wraps = Boolean(data.wraps);
    // Gusts that shove you while you hang from a ring here (see climbing.js).
    this.climbWind = data.climbWind ?? null;
    // Up in the snow, or underground: what shows under blocks and boulders.
    this.snowy = Boolean(data.snowy);
    this.cave = Boolean(data.cave);
    // The scarlet forest: leaf litter under blocks and trees with nothing else to go by.
    this.leafy = Boolean(data.leafy);
    // Lit by its own lamps and fires (see lamplight.js): those lights are
    // drawn live over the room, so they aren't painted into its floor.
    this.lamplit = isLamplit(data);
    this.width = data.tiles[0].length;
    this.height = data.tiles.length;
    this.pixelWidth = this.width * T;
    this.pixelHeight = this.height * T;
    this.playerStart = data.playerStart;
    // Every prop the room has; `props` is the ones here right now.
    this.allProps = data.props.map((info) => {
      const prop = new Prop(info);
      prop.showsUp = { until: info.until, after: info.after, join: info.join };
      // Gifts are remembered by room, look and spot, so they're only given once.
      prop.key = `${data.id}:${info.sprite}:${info.x},${info.y}`;
      if (info.gives && (WORLD_STATE.taken ?? []).includes(prop.key)) prop.markTaken();
      // Up on a block: drawn standing on top of it, and only in reach from up there.
      prop.raise = TILES[data.tiles[info.y]?.[info.x]]?.raise ?? 0;
      // Already read: no more "!" over it.
      if (info.notice && (WORLD_STATE.read ?? []).includes(prop.key)) prop.noticed = true;
      return prop;
    });
    this.id = data.id;
    this.placeStorage(data);
    this.refreshShowsUp();
    this.refreshPuzzles();
    // Cracked and broken floor, keyed by "tx,ty". Kept apart from the tile data
    // so restarting the room brings the floor back.
    this.damage = new Map();

    this.tiles.forEach((row, y) => {
      if (row.length !== this.width) {
        throw new Error(`Room row ${y} is ${row.length} tiles wide, expected ${this.width}`);
      }
    });

    // Tiles never change, so draw them once and reuse the image every frame.
    // Standing tiles (tall pillars, statues) are drawn with the characters instead.
    this.background = this.renderBackground();
    this.standing = this.findStandingTiles();
  }

  // One drawable per standing tile, sorted with the characters by its base,
  // so the player and enemies can pass (or hide) behind it.
  findStandingTiles() {
    const pieces = [];
    this.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
      const tile = TILES[char];
      // A raised block's top reaches up over the tile behind it, so whoever
      // stands back there is hidden behind it, not drawn on top of it. Just
      // that strip is drawn again (copied from the room's picture, lights and
      // all), sorted a hair before anything standing up on the block (props
      // up there, or you: see Player.sortY).
      if (tile?.raise) {
        const top = Math.max(0, ty * T - tile.raise);
        pieces.push({
          x: tx * T + T / 2,
          sortY: (ty + 1) * T - 0.5,
          draw: (ctx, camera) => ctx.drawImage(this.background, tx * T, top, T, ty * T - top, tx * T - camera.x, top - camera.y, T, ty * T - top),
        });
        return;
      }
      if (!tile?.standing) return;
      let picture = null;
      pieces.push({
        sortY: (ty + 1) * T,
        draw: (ctx, camera) => tile.draw(ctx, tx * T - camera.x, ty * T - camera.y, tx, ty, this),
        // Its shadow in the sun (see shadows.js), from a picture of it drawn once.
        shadow: () => {
          picture ??= standingPicture(tile, tx, ty, this);
          return { image: picture, x: tx * T + T / 2, y: (ty + 1) * T };
        },
      });
    }));
    return pieces;
  }

  // --- Puzzles: switches and gates (see Prop) ---
  // Switches remember whether they're on, by room and name, in the save.
  leverKey(name) {
    return `${this.id}:${name}`;
  }

  isLeverOn(name) {
    return (WORLD_STATE.levers ?? []).includes(this.leverKey(name));
  }

  // Shows each switch on or off, and opens the gates whose switches are all on.
  // Returns the gates that just opened.
  refreshPuzzles() {
    const opened = [];
    for (const prop of this.props) {
      if (prop.lever) prop.setOn(this.isLeverOn(prop.lever));
      if (prop.opensWith) {
        const open = prop.opensWith.every((name) => this.isLeverOn(name));
        if (open && !prop.isOpen) opened.push(prop);
        prop.isOpen = open;
      }
    }
    return opened;
  }

  // Flips a switch. An in-order gate whose switches are no longer being turned
  // on in its order resets them all. Returns { opened, reset } gates.
  flipLever(name) {
    WORLD_STATE.levers ??= [];
    const key = this.leverKey(name);
    const on = !this.isLeverOn(name);
    if (on) WORLD_STATE.levers.push(key);
    else WORLD_STATE.levers.splice(WORLD_STATE.levers.indexOf(key), 1);
    const reset = [];
    for (const gate of this.props.filter((p) => p.inOrder && p.opensWith?.includes(name) && !p.isOpen)) {
      const lit = gate.opensWith.filter((n) => this.isLeverOn(n));
      const inOrder = lit.every((n, i) => n === gate.opensWith[i]);
      if (!inOrder) {
        WORLD_STATE.levers = WORLD_STATE.levers.filter((k) => !gate.opensWith.some((n) => k === this.leverKey(n)));
        reset.push(gate);
      }
    }
    return { opened: this.refreshPuzzles(), reset };
  }

  // Tile character at (tx, ty), or null outside the room.
  tileAt(tx, ty) {
    if (this.wraps) tx = ((tx % this.width) + this.width) % this.width;
    if (tx < 0 || ty < 0 || tx >= this.width || ty >= this.height) return null;
    return this.tiles[ty][tx];
  }

  // In a spire room, a box near one edge is also next to the props at the other.
  propBlocks(prop, left, top, right, bottom) {
    if (prop.blocks(left, top, right, bottom)) return true;
    if (!this.wraps) return false;
    const w = this.pixelWidth;
    return prop.blocks(left + w, top, right + w, bottom) || prop.blocks(left - w, top, right - w, bottom);
  }

  isSolidTile(tx, ty) {
    const tile = this.tileAt(tx, ty);
    return tile === null || TILES[tile].solid;
  }

  // How high a tile's floor is: 0, or a block's `raise`.
  raiseAt(tx, ty) {
    const tile = this.tileAt(tx, ty);
    return tile === null ? 0 : TILES[tile].raise ?? 0;
  }

  // Whether the box (right and bottom exclusive) overlaps a solid tile or prop.
  // Raised blocks count as solid too, unless `climbing` (the player, who can
  // jump; they check the block's height themselves with floorHeight).
  collides(left, top, right, bottom, climbing = false) {
    for (let ty = Math.floor(top / T); ty <= Math.floor((bottom - 1) / T); ty++) {
      for (let tx = Math.floor(left / T); tx <= Math.floor((right - 1) / T); tx++) {
        if (this.isSolidTile(tx, ty)) return true;
        if (!climbing && this.raiseAt(tx, ty) > 0) return true;
      }
    }
    return this.props.some((prop) => this.propBlocks(prop, left, top, right, bottom));
  }

  // The highest floor under the box: where something standing there would stand.
  floorHeight(left, top, right, bottom) {
    let height = 0;
    for (let ty = Math.floor(top / T); ty <= Math.floor((bottom - 1) / T); ty++) {
      for (let tx = Math.floor(left / T); tx <= Math.floor((right - 1) / T); tx++) {
        height = Math.max(height, this.raiseAt(tx, ty));
      }
    }
    return height;
  }

  propAt(x, y) {
    const w = this.pixelWidth;
    const shifts = this.wraps ? [0, w, -w] : [0];
    return this.props.find((prop) => shifts.some((s) => prop.overlaps(x + s, y, x + s + 1, y + 1))) ?? null;
  }

  // Each landing cracks the tile under the player a little more, and the tile
  // gives way on the landing after it is fully cracked. Damage belongs to the
  // tile, not to a jump streak, and it never heals while the room lives.
  landOn(tx, ty) {
    const tile = this.damageAt(tx, ty);
    if (tile.cracks >= MAX_CRACKS) {
      tile.broken = true;
      return 'broken';
    }
    tile.cracks += 1;
    return 'cracked';
  }

  damageAt(tx, ty) {
    const key = `${tx},${ty}`;
    if (!this.damage.has(key)) this.damage.set(key, { tx, ty, cracks: 0, broken: false });
    return this.damage.get(key);
  }

  drawDamage(ctx, camera) {
    for (const { tx, ty, cracks, broken } of this.damage.values()) {
      const x = tx * T - camera.x;
      const y = ty * T - camera.y;
      if (broken) {
        drawHole(ctx, x, y);
      } else {
        ctx.fillStyle = '#120c1c';
        for (const [cx, cy, w, h] of CRACKS.slice(0, CRACK_RECTS_PER_LEVEL[cracks])) {
          ctx.fillRect(x + cx, y + cy, w, h);
        }
      }
    }
  }

  renderBackground() {
    const canvas = document.createElement('canvas');
    canvas.width = this.pixelWidth;
    canvas.height = this.pixelHeight;
    const ctx = canvas.getContext('2d');

    for (let ty = 0; ty < this.height; ty++) {
      for (let tx = 0; tx < this.width; tx++) {
        const char = this.tiles[ty][tx];
        const tile = TILES[char];
        if (!tile) throw new Error(`Unknown tile '${char}' at (${tx}, ${ty})`);
        (tile.standing ? TILES[floorUnder(this, tx, ty)] : tile).draw(ctx, tx * T, ty * T, tx, ty, this);
      }
    }
    // Depth where the ground ends at open sky (see drawDrops in tileset.js).
    drawDrops(ctx, this);
    this.paintLight(ctx);
    return canvas;
  }

  // A storage chest by every save point (see storageMenu.js), on a free tile
  // beside it: plain floor, not a door, a cutscene trigger or a wind geyser,
  // and never where it would cut off any of the room you could reach.
  placeStorage(data) {
    const saves = this.allProps.filter((prop) => prop.save);
    if (!saves.length) return;
    const busy = new Set();
    const mark = (x, y, w = 1, h = 1) => { for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) busy.add(`${x + i},${y + j}`); };
    for (const d of data.doors ?? []) { mark(d.x, d.y, d.w, d.h); mark(d.spawn.x, d.spawn.y); }
    for (const c of data.cutscenes ?? []) mark(c.x, c.y, c.w, c.h);
    for (const g of [...(data.geysers ?? []), ...(data.gusts ?? []), ...(data.whirls ?? [])]) mark(g.x, g.y, g.w ?? 1, g.h ?? 1);
    for (const prop of this.allProps) mark(prop.x / T, prop.y / T, prop.width / T, 1);
    mark(data.playerStart.x, data.playerStart.y);
    const open = (x, y) => !this.isSolidTile(x, y) && !busy.has(`${x},${y}`);
    const reachable = (blocked) => {
      const key = (x, y) => `${this.wraps ? ((x % this.width) + this.width) % this.width : x},${y}`;
      const seen = new Set([key(data.playerStart.x, data.playerStart.y)]);
      const queue = [[data.playerStart.x, data.playerStart.y]];
      while (queue.length) {
        const [x, y] = queue.pop();
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx;
          const ny = y + dy;
          const k = key(nx, ny);
          if (seen.has(k) || k === blocked || this.isSolidTile(nx, ny)) continue;
          if (this.allProps.some((p) => !p.walkable && nx * T >= p.x && nx * T < p.x + p.width && ny * T === p.y)) continue;
          seen.add(k);
          queue.push([nx, ny]);
        }
      }
      return seen.size;
    };
    const everywhere = reachable(null);
    for (const save of saves) {
      const sx = save.x / T;
      const sy = save.y / T;
      const spot = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]
        .map(([dx, dy]) => [sx + dx, sy + dy])
        .find(([x, y]) => open(x, y) && reachable(`${x},${y}`) >= everywhere - 1);
      if (!spot) continue;
      const chest = new Prop({ sprite: 'storage_chest', x: spot[0], y: spot[1], text: null, storage: true });
      chest.showsUp = {};
      chest.key = `${data.id}:storage:${spot[0]},${spot[1]}`;
      chest.raise = TILES[data.tiles[spot[1]]?.[spot[0]]]?.raise ?? 0;
      this.allProps.push(chest);
      mark(spot[0], spot[1]);
    }
  }

  // Brings props in or out of the room as the story moves on: called when the
  // room is made and after every cutscene (so Taper can be waiting somewhere
  // the moment a scene ends, instead of popping in later).
  refreshShowsUp() {
    this.props = this.allProps.filter((prop) => showsUpNow(prop.showsUp));
  }

  // Everything giving off light, for dark rooms: { x, y, radius } in world
  // pixels. Lantern pillars and candle stands, lit props (and lantern posts
  // once they're lit), save crystals, and any prop with its own `light`.
  lightSources() {
    this.tileLights ??= this.tiles.flatMap((row, ty) => [...row].flatMap((char, tx) => (
      DARK_TILE_LIGHTS[char] ? [{ x: tx * T + T / 2, y: ty * T, radius: DARK_TILE_LIGHTS[char] }] : []
    )));
    const props = this.props.flatMap((prop) => {
      if (prop.hidden) return [];
      const radius = prop.light ?? (prop.save ? 44 : PROP_LIGHTS[prop.look] ? PROP_LIGHTS[prop.look][0] * 1.4 : 0);
      return radius ? [{ x: prop.x + prop.width / 2, y: prop.y + T / 2 - (prop.raise ?? 0), radius }] : [];
    });
    return [...this.tileLights, ...props];
  }

  // Warm pools of light on the stone around lanterns, candles and save crystals.
  paintLight(ctx) {
    const lights = [];
    this.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
      if (char === 'P') lights.push([tx, ty, 38, 0.16]);
      if (char === 'C') lights.push([tx, ty, 34, 0.14]);
      // Cabin windows spill warm light; ice crystals a cold blue one.
      if (char === 'w' && !this.lamplit) lights.push([tx, ty + 0.5, 30, 0.14]);
      if (char === 'x') lights.push([tx, ty, 30, 0.16, '120, 200, 255']);
    }));
    for (const prop of this.props) {
      if (this.lamplit && (prop.glow ?? PROP_GLOWS[prop.look])) continue;
      const [radius, strength] = prop.save ? [30, 0.12] : PROP_LIGHTS[prop.look] ?? [];
      if (radius) lights.push([(prop.x + prop.width / 2) / T - 0.5, prop.y / T, radius, strength]);
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const [tx, ty, radius, strength, tint = '255, 190, 110'] of lights) {
      const cx = tx * T + T / 2;
      const cy = ty * T + T / 2;
      const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
      glow.addColorStop(0, `rgba(${tint}, ${strength})`);
      glow.addColorStop(1, `rgba(${tint}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
}
