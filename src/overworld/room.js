import { TILE_SIZE as T } from '../config.js';
import { TILES, floorUnder, drawDrops } from './tileset.js';
import { standingPicture } from './shadows.js';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
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
  // The Lantern Marsh's old lanterns on poles, still burning.
  marsh_lantern: [40, 0.14],
  campfire: [40, 0.2],
  brazier: [34, 0.18],
  stove_pot: [22, 0.1],
  street_lamp: [34, 0.14],
};

// What sinks into what: logs (and casks) into brook water, and out in the
// Lantern Marsh, logs and rocks both into its bog and its fen water, where
// they settle in the soft bottom as somewhere to step.
const LOG_SINKS = new Set(['~', '%', '$']);
const ROCK_SINKS = new Set(['%', '$']);

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
      if ((info.gives || info.gold) && (WORLD_STATE.taken ?? []).includes(prop.key)) prop.markTaken();
      // Up on a block: drawn standing on top of it, and only in reach from up there.
      prop.raise = TILES[data.tiles[info.y]?.[info.x]]?.raise ?? 0;
      // Already read: no more "!" over it.
      if (info.notice && (WORLD_STATE.read ?? []).includes(prop.key)) prop.noticed = true;
      return prop;
    });
    this.id = data.id;
    this.doors = data.doors ?? [];
    // The Hushwood's puzzles (see hushwood.js): brook tiles bridged by sunk
    // logs ("x,y"), and the treadles held down right now. Both start fresh
    // every time you come in, until the room's been got through (`passed`,
    // in the save): then its bridges and fallen trees stay, and its treadle
    // gates stay open.
    this.bridged = new Set();
    // What sank there, for a room you've got through ("x,y" to its look).
    this.bridgeLooks = new Map();
    this.treadlesDown = new Set();
    this.passed = WORLD_STATE.passed?.[data.id] ?? null;
    this.applyPassed();
    this.placeStorage(data);
    this.refreshShowsUp();
    this.clearUnsolvedButtons();
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
      let sprite = null;
      const height = tile.height ?? T;
      pieces.push({
        // Its middle, for placing it round a spire (OverworldScene.drawOnSpire).
        x: tx * T + T / 2,
        sortY: (ty + 1) * T,
        // Off the screen, it isn't drawn at all. On it, a tile that never
        // changes (a tree, a pillar) is drawn once into a little picture and
        // that's reused every frame: a wood of a hundred scarlet trees is
        // thousands of tiny rectangles otherwise. Ones that move (a
        // candelabra's flames, a dripping stalactite) are drawn live.
        draw: (ctx, camera) => {
          const sx = tx * T - camera.x;
          const sy = ty * T - camera.y;
          if (sx < -2 * T || sx > SCREEN_WIDTH + T || sy < -T || sy - height > SCREEN_HEIGHT) return;
          if (tile.animated) {
            tile.draw(ctx, sx, sy, tx, ty, this);
            return;
          }
          sprite ??= standingSprite(tile, tx, ty, this);
          ctx.drawImage(sprite, sx - T, sy - height);
        },
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
    return this.treadlesDown.has(name) || (WORLD_STATE.levers ?? []).includes(this.leverKey(name));
  }

  // Whether a prop's `wet` says it has water in it now: every name listed is
  // a lever that's on, or (with a '!') off.
  isWet(prop) {
    return prop.wet.every((name) => (name.startsWith('!') ? !this.isLeverOn(name.slice(1)) : this.isLeverOn(name)));
  }

  // Shows each switch on or off, and opens the gates whose switches are all on.
  // Returns the gates that just opened.
  //
  // A gate held open by a treadle (`held`) won't shut on anyone standing in
  // it (`bodies`, each { x, y } under the feet): it waits till they're clear.
  // In a room you've got through, it stays open. Water in a channel (`wet`)
  // comes and goes with its sluice levers.
  refreshPuzzles(bodies = []) {
    const opened = [];
    for (const prop of this.props) {
      if (prop.lever) prop.setOn(this.isLeverOn(prop.lever));
      if (prop.button) prop.setOn(this.isLeverOn(prop.button));
      if (prop.treadle) prop.setOn(this.treadlesDown.has(prop.treadle));
      if (prop.wet) prop.hidden = !this.isWet(prop);
      if (prop.opensWith) {
        let open = prop.opensWith.every((name) => this.isLeverOn(name));
        if (prop.held && this.passed) open = true;
        if (!open && prop.isOpen && bodies.some((b) => b.x + 5 > prop.x && b.x - 5 < prop.x + prop.width && b.y > prop.y && b.y - 6 < prop.y + T)) open = true;
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

  // --- Push puzzles: rocks and buttons (see Prop) ---
  // Rocks start where the room puts them every time you come in, so a button
  // only stays down in the save once its gate has opened: the rest are let
  // up when the room is built.
  clearUnsolvedButtons() {
    if (!WORLD_STATE.levers) return;
    const open = (name) => this.allProps.some((gate) => gate.opensWith?.includes(name) && gate.opensWith.every((n) => this.isLeverOn(n)));
    for (const button of this.allProps.filter((p) => p.button && !open(p.button))) {
      WORLD_STATE.levers = WORLD_STATE.levers.filter((k) => k !== this.leverKey(button.button));
    }
  }

  get rocks() {
    return this.props.filter((prop) => prop.rock);
  }

  // Whether a log (or with `rock`, a rock) shoved into tile (tx, ty) would
  // sink there: open water or bog nothing's sunk into yet, and nothing in it.
  sinksAt(tx, ty, rock = false) {
    if (!(rock ? ROCK_SINKS : LOG_SINKS).has(this.tileAt(tx, ty)) || this.bridged.has(`${tx},${ty}`)) return false;
    // Not at the room's very edge: out there it's open water, and a log
    // just bumps against the bank and stops.
    if (this.onEdge(tx, ty)) return false;
    const box = [tx * T + 1, ty * T + 1, (tx + 1) * T - 1, (ty + 1) * T - 1];
    return !this.props.some((prop) => !prop.walkable && prop.overlaps(...box));
  }

  onEdge(tx, ty) {
    return tx <= 0 || ty <= 0 || tx >= this.width - 1 || ty >= this.height - 1;
  }

  // Whether (tx, ty) is water or bog with something sunk in it (a log, a
  // rock, a cask) that you're stepping on: you balance on it (see
  // OverworldScene.balance).
  isSteppingStone(tx, ty) {
    return LOG_SINKS.has(this.tileAt(tx, ty)) && this.bridged.has(`${tx},${ty}`);
  }

  // Bog under (tx, ty) that would swallow you: nothing sunk into it.
  isBog(tx, ty) {
    return this.tileAt(tx, ty) === '%' && !this.bridged.has(`${tx},${ty}`);
  }

  // Whether a rock could be shoved into tile (tx, ty): open floor (not up on
  // a block), not a doorway, and nothing solid there but a button.
  rockCanEnter(tx, ty, log = false) {
    // Out in the marsh, a rock shoved into the bog or the water sinks.
    if (!log && ROCK_SINKS.has(this.tileAt(tx, ty)) && !this.bridged.has(`${tx},${ty}`)) return this.sinksAt(tx, ty, true) ? 'sink' : false;
    if (this.isSolidTile(tx, ty) || this.raiseAt(tx, ty) > 0) return false;
    // A rock won't go into a current (it'd only sit there); a log or a cask
    // will, and rides it.
    if (!log && this.flowAt(tx, ty)) return false;
    if (this.doors.some((d) => tx >= d.x && tx < d.x + (d.w ?? 1) && ty >= d.y && ty < d.y + (d.h ?? 1))) return false;
    const box = [tx * T + 1, ty * T + 1, (tx + 1) * T - 1, (ty + 1) * T - 1];
    return !this.props.some((prop) => !prop.walkable && prop.overlaps(...box));
  }

  // Presses the buttons with a rock on them and lets the others up, except
  // where their gate has already opened (it stays open). Returns
  // { opened, pressed }: the gates that just opened, and whether any button
  // went down.
  settleButtons() {
    WORLD_STATE.levers ??= [];
    let pressed = false;
    for (const button of this.props.filter((p) => p.button)) {
      if (this.props.some((gate) => gate.isOpen && gate.opensWith?.includes(button.button))) continue;
      const down = this.rocks.some((rock) => !rock.slide && rock.x === button.x && rock.y === button.y);
      const key = this.leverKey(button.button);
      const was = this.isLeverOn(button.button);
      if (down && !was) {
        WORLD_STATE.levers.push(key);
        pressed = true;
      } else if (!down && was) {
        WORLD_STATE.levers = WORLD_STATE.levers.filter((k) => k !== key);
      }
    }
    return { opened: this.refreshPuzzles(), pressed };
  }

  // Every rock back where it started.
  resetRocks() {
    return this.resetPuzzle();
  }

  // --- The Hushwood's logs, trees and treadles (see hushwood.js) ---
  get logs() {
    return this.props.filter((prop) => prop.log);
  }

  // A log sinks into a brook tile and bridges it: walk across on its back.
  // (A cask in the drains wedges there the same way: its `_sunk` look.)
  sinkLog(log, tx, ty) {
    log.slide = null;
    log.moveToTile(tx, ty);
    log.sunk = true;
    log.walkable = true;
    // (A log in the marsh's bog or fen water sits in mud, not brook water.)
    const marshy = ROCK_SINKS.has(this.tileAt(tx, ty));
    log.setLook(marshy && log.baseLook === 'roll_log' ? 'roll_log_bog' : `${log.baseLook}_sunk`);
    this.bridged.add(`${tx},${ty}`);
    this.bridgeLooks.set(`${tx},${ty}`, log.baseLook);
  }

  // A log that came from a felled tree, lying where it fell (or sunk there).
  addLog(tx, ty, sunk = false, look = 'roll_log') {
    const log = new Prop({ sprite: look, x: tx, y: ty, text: look === 'roll_log' ? 'roll_log' : null, log: true });
    log.showsUp = {};
    log.made = true;
    log.key = `${this.id}:log:${tx},${ty}`;
    this.allProps.push(log);
    this.props?.push(log);
    if (sunk) this.sinkLog(log, tx, ty);
    return log;
  }

  // A thin tree, felled (a stump now, which you can walk over), or a hollow
  // trunk split open.
  fell(tree) {
    tree.felled = true;
    tree.walkable = true;
    // (Roots grown through a culvert mouth split the same way: their `_open` look.)
    tree.setLook(tree.chop === 'open' ? `${tree.baseLook}_open` : 'thin_pine_stump');
  }

  // A room you've got through comes back as you left it: bridges where its
  // logs sank, its trees down. Hollow trunks you split stay split anywhere.
  applyPassed() {
    const opened = WORLD_STATE.chopped ?? [];
    for (const prop of this.allProps) if (prop.chop === 'open' && opened.includes(prop.key)) this.fell(prop);
    const passed = this.passed;
    if (!passed) return;
    for (const prop of this.allProps) {
      if (prop.chop === 'fell' && passed.felled?.includes(prop.key)) this.fell(prop);
      if ((prop.log || prop.rock) && passed.usedLogs?.includes(prop.key)) prop.hidden = true;
    }
    for (const at of passed.bridges ?? []) {
      // ("x,y", or "x,y,look" for something other than a log: a rock in the bog.)
      const [tx, ty, look] = at.split(',');
      this.addLog(Number(tx), Number(ty), true, look || 'roll_log');
    }
  }

  // What to remember once you've got through: the bridges, the felled trees,
  // and which of the room's own logs ended up in the water.
  passedState() {
    return {
      bridges: [...this.bridged].map((at) => {
        const look = this.bridgeLooks.get(at);
        return look && look !== 'roll_log' ? `${at},${look}` : at;
      }),
      felled: this.allProps.filter((p) => p.chop === 'fell' && p.felled).map((p) => p.key),
      usedLogs: this.allProps.filter((p) => (p.log || p.rock) && !p.made && (p.sunk || p.hidden)).map((p) => p.key),
    };
  }

  // Everything back as it was when you came in: rocks and logs home, logs
  // out of the water, felled trees standing again. In a room you've got
  // through, only its rocks (the rest has settled for good).
  resetPuzzle() {
    for (const rock of this.rocks) {
      // (In a room you've got through, a rock sunk in the bog stays sunk.)
      if (rock.sunk && this.passed) continue;
      rock.slide = null;
      rock.x = rock.home.x;
      rock.y = rock.home.y;
      if (rock.sunk) {
        rock.sunk = false;
        rock.walkable = false;
        rock.setLook();
      }
    }
    if (!this.passed) {
      this.allProps = this.allProps.filter((p) => !p.made);
      for (const log of this.allProps.filter((p) => p.log)) {
        log.slide = null;
        log.x = log.home.x;
        log.y = log.home.y;
        log.sunk = false;
        log.walkable = false;
        log.hidden = false;
        log.setLook();
      }
      for (const tree of this.allProps.filter((p) => p.chop === 'fell' && p.felled)) {
        tree.felled = false;
        tree.walkable = false;
        tree.setLook();
      }
      this.bridged.clear();
      this.bridgeLooks.clear();
      this.refreshShowsUp();
    }
    this.treadlesDown.clear();
    return this.settleButtons();
  }

  // Treadles go down under anyone standing on them (`bodies`, feet points)
  // or a rock or log at rest on them, and come up when they're clear.
  // Returns whether any went up or down.
  settleTreadles(bodies) {
    const down = new Set();
    for (const treadle of this.props.filter((p) => p.treadle)) {
      const tx = treadle.x / T;
      const ty = treadle.y / T;
      const stood = bodies.some((b) => Math.floor(b.x / T) === tx && Math.floor((b.y - 1) / T) === ty);
      const weighed = this.props.some((p) => (p.rock || p.log) && !p.sunk && !p.slide && !p.hidden && p.x === treadle.x && p.y === treadle.y);
      if (stood || weighed) down.add(treadle.treadle);
    }
    const changed = down.size !== this.treadlesDown.size || [...down].some((name) => !this.treadlesDown.has(name));
    this.treadlesDown = down;
    return changed;
  }

  // Where a sliding log can go next: 'sink' into open brook water, true onto
  // open floor (as a rock could), false if it's stopped.
  logCanEnter(tx, ty) {
    if (LOG_SINKS.has(this.tileAt(tx, ty)) && !this.bridged.has(`${tx},${ty}`)) return this.sinksAt(tx, ty) ? 'sink' : false;
    return this.rockCanEnter(tx, ty, true);
  }

  // The way the current runs on a tile ('up', 'down', 'left', 'right'), or
  // null: a `flow` prop there that's running now (see Prop).
  flowAt(tx, ty) {
    const x = tx * T;
    const y = ty * T;
    return this.props.find((prop) => prop.flow && !prop.hidden && prop.x === x && prop.y === y)?.flow ?? null;
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
    if (tile === null) return true;
    return TILES[tile].solid && !this.bridged.has(`${tx},${ty}`);
  }

  // How high a tile's floor is: 0, or a block's `raise`.
  raiseAt(tx, ty) {
    const tile = this.tileAt(tx, ty);
    return tile === null ? 0 : TILES[tile].raise ?? 0;
  }

  // Whether the box (right and bottom exclusive) overlaps a solid tile or prop.
  // Raised blocks count as solid too, unless `climbing` (the player, who can
  // jump; they check the block's height themselves with floorHeight).
  // A `small` mover (Bramble, on his own) goes through kid gaps.
  collides(left, top, right, bottom, climbing = false, small = false) {
    for (let ty = Math.floor(top / T); ty <= Math.floor((bottom - 1) / T); ty++) {
      for (let tx = Math.floor(left / T); tx <= Math.floor((right - 1) / T); tx++) {
        if (this.isSolidTile(tx, ty)) return true;
        if (!climbing && this.raiseAt(tx, ty) > 0) return true;
      }
    }
    // Whoever's standing still while the other of you goes off (`blockers`,
    // set by OverworldScene) is in the way too: nobody walks through a friend.
    if ((this.blockers ?? []).some((b) => left < b.x + 5 && right > b.x - 5 && top < b.y && bottom > b.y - 6)) return true;
    return this.props.some((prop) => !(small && prop.gap) && this.propBlocks(prop, left, top, right, bottom));
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

// A standing tile drawn once into its own picture, three tiles wide (it can
// spread past its tile) and tall enough for its height, standing on the
// middle tile of the bottom row: the same drawing as tile.draw, kept.
function standingSprite(tile, tx, ty, room) {
  const height = tile.height ?? T;
  const canvas = document.createElement('canvas');
  canvas.width = T * 3;
  canvas.height = height + T;
  tile.draw(canvas.getContext('2d'), T, height, tx, ty, room);
  return canvas;
}
