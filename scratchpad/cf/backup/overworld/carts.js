import { TILE_SIZE as T, SCREEN_WIDTH, SCREEN_HEIGHT } from '../config.js';
import { sfx } from '../audio/music.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { makeSprite } from '../engine/sprite.js';
import { animationFrame } from '../engine/animations.js';
import { Prop } from './prop.js';
import { textSection } from '../engine/textLoader.js';
import { inUiSpace } from '../engine/screen.js';
import { drawText } from '../ui/text.js';
import { VES } from './windGeyser.js';
import { railTile, CART_BACK_ROWS, CART_FX_COLORS, CART_FX_SPRITES } from '../data/art/carts.js';

// The Diggings' mine carts and the track they run on (Chapter 4).
//
// RAILS are a room field, `rails`: rows of glyphs the same size as `tiles`,
// laid over the floor. Rails are flat, walkable floor when nothing is on them.
//   ─ │            straight track (left-right, up-down)
//   ┌ ┐ └ ┘        curves (the two edges they join: ┌ is right and down)
//   ┬ ┴ ├ ┤        a junction, three ways (┬ joins left, right and down)
//   ┼              a crossing: carts roll straight over it
//   ╴ ╵ ╶ ╷        the end of the line: track from that edge to a buffer stop
//   . or space     no track
// (Plain - and | work for straights too.)
//
// A junction's SWITCH is thrown by any switch name the room knows (a lever,
// a button, a treadle): list it in the room's `switches`, and a `rail_lever`
// prop with `switch: 'name'` throws it. A switch entry with `spring: true` is
// thrown by the carts themselves (a wheel coming in off a branch sets it that
// way). See the builders' guide for the lot.
//
// CARTS are props with `cart: true` (or a name) sitting on a rail. Z beside
// one to climb in and ride: it rolls itself along the track (the track
// decides where) till it reaches the end of the line, a barricade or
// anything in the way, and you hop out. Walk into an empty cart to send it
// off by itself. A cart that reaches a door on its rail takes you through.
//
// A room can dress a ride up as a set piece with a `ride` field (opt-in; it
// only changes how the ride looks and sounds, never where the cart goes):
//   ride: { crumble: true,        planks ('g' tiles) drop away behind the cart (drawn only; all back when the ride ends)
//           line: 'section',      a line of Ves's, shown over the ride the first time (needs her riding along)
//           lineText: 'file',     the text file it is in
//           beats: [ { at: [x, y], dir: 'R', ... } ] }
// A beat fires as the cart rolls onto that tile (dir, if given, is the way it is
// then heading: U D L R). Its doing parts, all optional: cruise (top speed from
// here on), bias [x, y] (the camera looks that many pixels off the cart; null
// to settle back), shake [pixels, seconds], sfx (a name or a list), sparks n,
// dust n, bats n (a flock bursts up out of the dark), line (show Ves's line).

const DIRS = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
const OPP = { U: 'D', D: 'U', L: 'R', R: 'L' };
const FACING = { U: 'up', D: 'down', L: 'left', R: 'right' };
const FROM_FACING = { up: 'U', down: 'D', left: 'L', right: 'R' };
const CLOCKWISE = 'URDL';
const EDGE = { L: [0, 8], R: [16, 8], U: [8, 0], D: [8, 16] };

const GLYPHS = {
  '─': 'LR', '-': 'LR', '│': 'UD', '|': 'UD',
  '┌': 'RD', '┐': 'LD', '└': 'RU', '┘': 'LU',
  '┬': 'LRD', '┴': 'LRU', '├': 'UDR', '┤': 'UDL', '┼': 'LRUD',
  '╴': 'L', '╵': 'U', '╶': 'R', '╷': 'D',
};

// Pixels a second, and how fast it picks up and brakes.
const CRUISE = 104;
const ACCEL = 230;
const BRAKE = 420;
const SHOVE_SPEED = 46;
// How long you have to lean on an empty cart before it goes, and how long a
// rider waits in the cart before it moves off.
const SHOVE_SECONDS = 0.3;
const BOARD_SECONDS = 0.4;
const CAMERA_EASE = 10;

const fxSprites = Object.fromEntries(Object.entries(CART_FX_SPRITES).map(([name, rows]) => [name, makeSprite(rows, CART_FX_COLORS)]));
// Bats for a room's set-piece ride (see `ride` below): wings up, wings down.
const BAT_COLORS = { b: '#9a88c0', d: '#41345c' };
const batSprites = [
  makeSprite(['d.....d', 'db...bd', '.dbbbd.', '..dbd..'], BAT_COLORS),
  makeSprite(['..dbd..', '.dbbbd.', 'db...bd', 'd.....d'], BAT_COLORS),
];
const tileCache = new Map();

function cachedTile(options) {
  const key = `${options.arms}|${options.route ?? ''}|${options.stub ? 's' : ''}|${options.arrow ?? ''}`;
  if (!tileCache.has(key)) tileCache.set(key, railTile(options));
  return tileCache.get(key);
}

// A leg is one tile's worth of track, from the arm a cart comes in by to the
// arm it leaves by: a straight 16 pixels, or a quarter circle of radius 8
// about the tile's corner. Positions are in the tile's own pixels.
function makeLeg(inArm, outArm) {
  const leg = { in: inArm, out: outArm, bumper: false, stopS: null, smash: null, doorAt: null };
  if (OPP[inArm] === outArm) {
    leg.kind = 'straight';
    leg.len = 16;
    leg.from = EDGE[inArm];
    leg.heading = DIRS[outArm];
    return leg;
  }
  const kx = inArm === 'R' || outArm === 'R' ? 16 : 0;
  const ky = inArm === 'D' || outArm === 'D' ? 16 : 0;
  const a0 = Math.atan2(EDGE[inArm][1] - ky, EDGE[inArm][0] - kx);
  const a1 = Math.atan2(EDGE[outArm][1] - ky, EDGE[outArm][0] - kx);
  let turn = a1 - a0;
  while (turn > Math.PI) turn -= 2 * Math.PI;
  while (turn < -Math.PI) turn += 2 * Math.PI;
  leg.kind = 'curve';
  leg.len = 8 * Math.abs(turn);
  Object.assign(leg, { kx, ky, a0, sign: Math.sign(turn) });
  return leg;
}

function legPoint(leg, s) {
  if (leg.kind === 'straight') return [leg.from[0] + leg.heading[0] * s, leg.from[1] + leg.heading[1] * s];
  const a = leg.a0 + leg.sign * (s / 8);
  return [leg.kx + 8 * Math.cos(a), leg.ky + 8 * Math.sin(a)];
}

function legHeading(leg, s) {
  if (leg.kind === 'straight') return leg.heading;
  const a = leg.a0 + leg.sign * (s / 8);
  return [-leg.sign * Math.sin(a), leg.sign * Math.cos(a)];
}

// Mistakes in a room's rails, as a list of plain sentences (empty if it's
// fine): for the preview's room check. `rooms` is every room by id.
export function railProblems(data, rooms) {
  const out = [];
  const width = data.tiles[0].length;
  const height = data.tiles.length;
  let grid;
  try {
    grid = Carts.prototype.parseRails.call({ data, room: { width, height }, setBranches: Carts.prototype.setBranches });
  } catch (e) {
    return [e.message];
  }
  const doors = data.doors ?? [];
  const inDoor = (x, y) => doors.some((d) => x >= d.x && x < d.x + (d.w ?? 1) && y >= d.y && y < d.y + (d.h ?? 1));
  for (const piece of grid.values()) {
    for (const arm of piece.arms) {
      const [dx, dy] = DIRS[arm];
      const nx = piece.x + dx;
      const ny = piece.y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const next = grid.get(`${nx},${ny}`);
      if (!next || !next.arms.includes(OPP[arm])) {
        if (inDoor(piece.x, piece.y)) continue;
        out.push(`the rail at ${piece.x},${piece.y} runs ${FACING[arm]} into nothing (no rail meets it at ${nx},${ny}); end a line with a stub piece`);
      }
    }
    if (inDoor(piece.x, piece.y)) {
      for (const door of doors.filter((d) => piece.x >= d.x && piece.x < d.x + (d.w ?? 1) && piece.y >= d.y && piece.y < d.y + (d.h ?? 1))) {
        const there = rooms[door.to];
        const arrival = there?.rails?.[door.spawn.y]?.[door.spawn.x];
        if (!there || !arrival || arrival === '.' || arrival === ' ') out.push(`the door at ${piece.x},${piece.y} has rail in it, but its spawn ${door.spawn.x},${door.spawn.y} in ${door.to} isn't on a rail (a cart can't arrive)`);
      }
    }
  }
  for (const prop of data.props ?? []) {
    if (prop.cart && !grid.get(`${prop.x},${prop.y}`)) out.push(`the cart at ${prop.x},${prop.y} isn't on a rail`);
    if (prop.cart && grid.get(`${prop.x},${prop.y}`)?.arms.length >= 3) out.push(`the cart at ${prop.x},${prop.y} sits on a junction: move it onto plain track`);
    if (prop.smash && !grid.get(`${prop.x},${prop.y}`)) out.push(`the barricade at ${prop.x},${prop.y} isn't on a rail`);
    if (prop.sprite === 'rail_lever' && prop.switch && !(data.switches ?? []).some((s) => s.name === prop.switch)) out.push(`the rail lever for '${prop.switch}' at ${prop.x},${prop.y} has no matching entry in switches`);
  }
  return out;
}

export class Carts {
  constructor(scene, arrival = null) {
    this.scene = scene;
    this.room = scene.room;
    this.data = scene.roomData;
    this.grid = this.parseRails();
    this.fx = [];
    this.riding = null;
    this.rideInfo = null;
    this.pushing = null;
    this.cam = null;
    this.bias = null;
    this.look = null;
    this.gone = new Set();
    this.bats = [];
    this.caption = null;
    this.time = 0;
    this.carts = this.room.allProps.filter((p) => p.cart).map((prop, i) => this.wrap(prop, typeof prop.cart === 'string' ? prop.cart : `c${i}`));
    this.load();
    if (arrival) this.arrive(arrival);
  }

  get active() {
    return this.grid.size > 0 || this.carts.length > 0;
  }

  // --- The track ---

  parseRails() {
    const grid = new Map();
    const rows = this.data.rails ?? [];
    rows.forEach((row, y) => {
      if (y >= this.room.height || row.length > this.room.width) throw new Error(`${this.data.id}: rails row ${y} doesn't fit the room`);
      [...row].forEach((glyph, x) => {
        if (glyph === ' ' || glyph === '.') return;
        const arms = GLYPHS[glyph];
        if (!arms) throw new Error(`${this.data.id}: unknown rail glyph '${glyph}' at ${x},${y}`);
        const piece = { x, y, arms, name: null, stem: null, branches: null };
        if (arms.length === 3) {
          // The leg of the T is the arm with nothing opposite it.
          piece.stem = [...arms].find((a) => !arms.includes(OPP[a]));
          this.setBranches(piece);
        }
        grid.set(`${x},${y}`, piece);
      });
    });
    for (const sw of this.data.switches ?? []) {
      const piece = grid.get(`${sw.x},${sw.y}`);
      if (!piece || piece.arms.length !== 3) throw new Error(`${this.data.id}: switch '${sw.name}' at ${sw.x},${sw.y} isn't on a three-way junction piece`);
      piece.name = sw.name;
      // A spring junction (`spring: true`) has no say from you: a cart rolling in off a branch
      // leaves it set for that branch, so the next one from the stem goes the same way.
      piece.spring = Boolean(sw.spring);
      if (sw.stem) {
        if (!piece.arms.includes(sw.stem)) throw new Error(`${this.data.id}: switch '${sw.name}' stem ${sw.stem} isn't one of its arms`);
        piece.stem = sw.stem;
        this.setBranches(piece);
      }
    }
    return grid;
  }

  // The two ways out of a junction from its stem: straight on first (if
  // there is a straight way), otherwise the one clockwise from the stem.
  setBranches(piece) {
    const others = [...piece.arms].filter((a) => a !== piece.stem);
    const straight = OPP[piece.stem];
    if (others.includes(straight)) {
      piece.branches = [straight, others.find((a) => a !== straight)];
    } else {
      others.sort((a, b) => ((CLOCKWISE.indexOf(a) - CLOCKWISE.indexOf(piece.stem) + 4) % 4) - ((CLOCKWISE.indexOf(b) - CLOCKWISE.indexOf(piece.stem) + 4) % 4));
      piece.branches = others;
    }
  }

  pieceAt(tx, ty) {
    return this.grid.get(`${tx},${ty}`) ?? null;
  }

  // Which way a junction is set: 0 (off) or 1 (on).
  stateOf(piece) {
    return piece.name && this.room.isLeverOn(piece.name) ? 1 : 0;
  }

  // The branch a cart coming in by the stem is sent down right now.
  branchNow(piece) {
    return piece.branches[this.stateOf(piece)];
  }

  // The arm a cart leaves by, coming in by `from` (null at the end of the line).
  exitFor(piece, from) {
    const arms = piece.arms;
    if (!arms.includes(from) || arms.length === 1) return null;
    if (arms.length === 2) return arms.replace(from, '');
    if (arms.length === 4) return OPP[from];
    return from === piece.stem ? this.branchNow(piece) : piece.stem;
  }

  // The arm a cart sitting on a tile would have come in by, to leave by `out`.
  entryFor(piece, out) {
    const arms = piece.arms;
    if (arms.length === 1) return OPP[out];
    if (arms.length === 2) return arms.replace(out, '');
    if (arms.length === 4) return OPP[out];
    return out === piece.stem ? this.branchNow(piece) : piece.stem;
  }

  doorAt(tx, ty) {
    return (this.data.doors ?? []).find((d) => tx >= d.x && tx < d.x + (d.w ?? 1) && ty >= d.y && ty < d.y + (d.h ?? 1)) ?? null;
  }

  // --- Carts ---

  wrap(prop, id) {
    const cart = { prop, id, home: { tx: prop.x / T, ty: prop.y / T }, tx: prop.x / T, ty: prop.y / T, state: 'rest', v: 0, leg: null, s: 0, dir: 'R', riders: false, made: false, recoil: 0, t: 0, followers: [] };
    prop.cartState = cart;
    prop.draw = (ctx, camera) => this.drawCart(cart, ctx, camera);
    if (!this.pieceAt(cart.tx, cart.ty) && this.data.rails) {
      throw new Error(`${this.data.id}: the cart '${id}' at ${cart.tx},${cart.ty} isn't on a rail`);
    }
    this.restLook(cart);
    return cart;
  }

  makeCart(tx, ty, id = `made${tx}_${ty}`) {
    const prop = new Prop({ sprite: 'mine_cart', x: tx, y: ty, cart: true });
    prop.showsUp = {};
    prop.key = `${this.data.id}:madecart:${tx},${ty}`;
    this.room.allProps.push(prop);
    this.room.props.push(prop);
    const cart = this.wrap(prop, id);
    cart.made = true;
    this.carts.push(cart);
    return cart;
  }

  byProp(prop) {
    return prop.cartState ?? null;
  }

  // The look a cart rests in: side-on on a level or curved track, end-on on an upright one.
  restLook(cart) {
    const piece = this.pieceAt(cart.tx, cart.ty);
    const upright = piece && !piece.arms.includes('L') && !piece.arms.includes('R');
    cart.prop.setLook(upright ? 'mine_cart_v' : 'mine_cart');
  }

  place(cart, tx, ty) {
    cart.tx = tx;
    cart.ty = ty;
    cart.prop.x = tx * T;
    cart.prop.y = ty * T;
    this.restLook(cart);
  }

  // --- What's remembered ---

  load() {
    const saved = WORLD_STATE.carts?.[this.data.id];
    if (!saved) return;
    for (const cart of this.carts) {
      const at = saved.carts?.[cart.id];
      if (at && this.pieceAt(at[0], at[1])) this.place(cart, at[0], at[1]);
    }
    for (const prop of this.room.allProps.filter((p) => p.smash)) {
      if (saved.smashed?.includes(prop.key)) this.breakProp(prop, false);
    }
    for (const [tx, ty] of saved.made ?? []) {
      if (this.pieceAt(tx, ty)) this.place(this.makeCart(tx, ty), tx, ty);
    }
  }

  save() {
    WORLD_STATE.carts ??= {};
    const carts = {};
    const made = [];
    for (const cart of this.carts) {
      if (cart.state === 'door' || cart.state === 'gone') continue;
      if (cart.made) made.push([cart.tx, cart.ty]);
      else if (cart.tx !== cart.home.tx || cart.ty !== cart.home.ty) carts[cart.id] = [cart.tx, cart.ty];
    }
    const smashed = this.room.allProps.filter((p) => p.smash && p.smashed).map((p) => p.key);
    if (!Object.keys(carts).length && !made.length && !smashed.length) delete WORLD_STATE.carts[this.data.id];
    else WORLD_STATE.carts[this.data.id] = { carts, smashed, made };
  }

  // Everything back where it began (the stump that rolls the rocks home does this too).
  reset() {
    if (this.riding) return;
    for (const cart of [...this.carts]) {
      cart.state = 'rest';
      cart.leg = null;
      cart.v = 0;
      if (cart.made) {
        this.room.allProps = this.room.allProps.filter((p) => p !== cart.prop);
        this.room.props = this.room.props.filter((p) => p !== cart.prop);
        this.carts = this.carts.filter((c) => c !== cart);
      } else {
        this.place(cart, cart.home.tx, cart.home.ty);
      }
    }
    for (const prop of this.room.allProps.filter((p) => p.smash && p.smashed)) {
      prop.smashed = false;
      prop.walkable = false;
      prop.sunk = false;
      prop.setLook();
    }
    delete WORLD_STATE.carts?.[this.data.id];
    // (Spring junctions go back to their first setting too.)
    for (const piece of this.grid.values()) {
      if (piece.spring && this.stateOf(piece)) this.room.flipLever(piece.name);
    }
    this.endRide();
    this.settle();
  }

  breakProp(prop, withEffects = true) {
    prop.smashed = true;
    prop.walkable = true;
    prop.sunk = true;
    prop.setLook('barricade_smashed');
    if (!withEffects) return;
    const cx = prop.x + T / 2;
    const cy = prop.y + T / 2;
    for (let i = 0; i < 9; i++) this.burst(i % 3 ? 'splinter_a' : 'splinter_b', cx, cy, 70, 0.7);
    for (let i = 0; i < 5; i++) this.burst('dust_a', cx, cy, 30, 0.8);
    sfx('crumble');
    sfx('hit');
    this.scene.shakeCamera(2, 0.25);
  }

  // --- Climbing in, and shoving ---

  // Z on a cart.
  use(prop) {
    const cart = this.byProp(prop);
    if (!cart || cart.state !== 'rest') return;
    const { scene } = this;
    if (scene.partner) {
      sfx('error');
      scene.textbox.open(['Better to get back together first. The cart only has room for the two of you.']);
      return;
    }
    const piece = this.pieceAt(cart.tx, cart.ty);
    const facing = FROM_FACING[scene.player.facing];
    // The way you're facing if the track goes that way and it's clear, else any way it can go.
    const ways = this.startOrder(cart, piece, facing);
    if (!ways.some((dir) => this.startRoll(cart, dir, true))) {
      sfx('error');
      if (prop.text) scene.say(this.data.textFile, prop.text);
      return;
    }
    sfx('push');
  }

  // The ways a cart might start, best first: the way you were facing if the
  // track goes that way, else the cart's own `dir`, else the way with the
  // longest run of track (so climbing in from the side never sets you off
  // into a one-tile stub).
  startOrder(cart, piece, facing) {
    if (!piece) return [];
    const arms = [...piece.arms];
    const longest = [...'RDLU'].sort((a, b) => this.runLength(cart, b) - this.runLength(cart, a));
    const order = [facing, cart.prop.dir, ...longest].filter(Boolean);
    return [...new Set(order)].filter((a) => arms.includes(a) && this.canGo(cart, piece, a));
  }

  // How many tiles a cart would roll setting off `dir` from where it stands,
  // following the track as the switches lie now (up to a cap).
  runLength(cart, dir) {
    let tx = cart.tx;
    let ty = cart.ty;
    let out = dir;
    for (let n = 0; n < 60; n++) {
      const [dx, dy] = DIRS[out];
      const next = this.pieceAt(tx + dx, ty + dy);
      if (!next || !next.arms.includes(OPP[out])) return n;
      tx += dx;
      ty += dy;
      out = this.exitFor(next, OPP[out]);
      if (out == null) return n + 1;
    }
    return 60;
  }

  canGo(cart, piece, dir) {
    const [dx, dy] = DIRS[dir];
    const next = this.pieceAt(cart.tx + dx, cart.ty + dy);
    return Boolean(next) && next.arms.includes(OPP[dir]);
  }

  // Sets a cart off from where it stands. False if it can't go (the way is blocked).
  startRoll(cart, dir, riders) {
    const piece = this.pieceAt(cart.tx, cart.ty);
    if (!piece || !piece.arms.includes(dir)) return false;
    cart.leg = makeLeg(this.entryFor(piece, dir), dir);
    cart.s = cart.leg.len / 2;
    cart.dir = dir;
    cart.v = riders ? 0 : SHOVE_SPEED;
    cart.riders = riders;
    this.plan(cart);
    if (cart.leg.stopS != null && cart.leg.stopS <= cart.s + 0.01) {
      cart.leg = null;
      cart.riders = false;
      return false;
    }
    cart.state = riders ? 'board' : 'roll';
    cart.t = 0;
    if (riders) this.board(cart);
    this.scene.room.settleButtons();
    return true;
  }

  board(cart) {
    const { scene } = this;
    const { player } = scene;
    this.riding = cart;
    player.hidden = true;
    player.moving = false;
    player.x = cart.prop.x + T / 2;
    player.y = cart.prop.y + T;
    cart.followers = scene.followers.filter((f) => !f.hidden);
    for (const f of cart.followers) {
      f.hidden = true;
      f.walking = false;
    }
    this.cam = { x: player.x, y: player.y };
    this.pushing = null;
    cart.cruise = null;
    this.endRide();
  }

  // Leaning on an empty cart sends it off by itself, away from you.
  push(dt, input) {
    const { scene } = this;
    const player = scene.player;
    if (this.riding || !this.carts.length) return;
    const dx = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0);
    const dy = (input.isDown('down') ? 1 : 0) - (input.isDown('up') ? 1 : 0);
    if (Boolean(dx) === Boolean(dy) || player.isAirborne || player.ground > 0 || scene.partner) {
      this.pushing = null;
      return;
    }
    const ax = player.x + dx;
    const ay = player.y + dy;
    const cart = this.carts.find((c) => c.state === 'rest' && c.prop.overlaps(ax - 5, ay - 6, ax + 5, ay)
      && (dx ? Math.abs(player.y - 3 - (c.prop.y + T / 2)) <= 5 : Math.abs(player.x - (c.prop.x + T / 2)) <= 5));
    if (!cart) {
      this.pushing = null;
      return;
    }
    const dir = dx > 0 ? 'R' : dx < 0 ? 'L' : dy > 0 ? 'D' : 'U';
    if (this.pushing?.cart !== cart || this.pushing.dir !== dir) this.pushing = { cart, dir, t: 0 };
    this.pushing.t += dt;
    if (this.pushing.t < SHOVE_SECONDS) return;
    this.pushing.t = 0;
    if (player.crutch) return;
    if (this.startRoll(cart, dir, false)) sfx('push');
  }

  // --- Rolling ---

  // Works out what's ahead of a cart on its current tile, and where (if
  // anywhere) it has to stop on this tile. Done every frame, so things that
  // step into the way are noticed in time.
  plan(cart) {
    const leg = cart.leg;
    const mid = leg.len / 2;
    let stop = null;
    leg.smash = null;
    if (leg.bumper) {
      stop = mid;
    } else {
      const [dx, dy] = DIRS[leg.out];
      const nx = cart.tx + dx;
      const ny = cart.ty + dy;
      const next = this.pieceAt(nx, ny);
      if (!next || !next.arms.includes(OPP[leg.out])) {
        stop = mid;
      } else {
        const block = this.blocker(cart, nx, ny);
        if (block?.smash) leg.smash = block.smash;
        else if (block) stop = mid;
      }
    }
    // Too late to stop on this tile: carry on.
    if (stop != null && cart.s > stop + 0.01) stop = null;
    leg.stopS = stop;
    leg.doorAt = cart.riders && this.doorAt(cart.tx, cart.ty) ? mid : null;
  }

  // What's in the way on a tile: a barricade an empty cart can break, or
  // something that stops it (null if the way is clear).
  blocker(cart, nx, ny) {
    const { scene, room } = this;
    if (room.isSolidTile(nx, ny)) return { stop: true };
    if (!cart.riders && this.doorAt(nx, ny)) return { stop: true };
    const box = [nx * T + 3, ny * T + 3, (nx + 1) * T - 3, (ny + 1) * T - 3];
    for (const p of room.props) {
      if (p === cart.prop || p.hidden || p.isOpen) continue;
      if (p.smash && !p.smashed && p.overlaps(...box)) return cart.riders ? { stop: true } : { smash: p };
      if (!p.walkable && p.overlaps(...box)) return { stop: true };
    }
    const on = (b) => b && !b.hidden && b.x > nx * T - 6 && b.x < (nx + 1) * T + 6 && b.y - 4 > ny * T - 6 && b.y - 4 < (ny + 1) * T + 6;
    // (Whoever's riding is in the cart, not in the way.)
    if (!cart.riders && (on(scene.player) || scene.others.some(on) || scene.followers.some(on))) return { stop: true };
    if (scene.npcs.some((npc) => npc.x > nx * T - 8 && npc.x < (nx + 1) * T + 8 && npc.y - 6 > ny * T - 8 && npc.y - 6 < (ny + 1) * T + 8)) return { stop: true };
    return null;
  }

  update(dt, input) {
    this.time += dt;
    this.updateFx(dt);
    if (this.caption && (this.caption.left -= dt) <= 0) this.caption = null;
    for (const cart of this.carts) {
      if (cart.recoil > 0) cart.recoil = Math.max(0, cart.recoil - dt);
      if (cart.state === 'board' || cart.state === 'roll') this.stepCart(cart, dt);
    }
    if (!this.riding) return false;
    const { scene } = this;
    const cart = this.riding;
    // Keep the camera rolling smoothly along with the cart.
    const k = 1 - Math.exp(-dt * CAMERA_EASE);
    const px = cart.prop.x + T / 2;
    const py = cart.prop.y + T / 2;
    // (A set-piece ride can ask the camera to look off to one side: `bias`.)
    this.look ??= { x: 0, y: 0 };
    const kb = 1 - Math.exp(-dt * 3.2);
    this.look.x += ((this.bias?.[0] ?? 0) - this.look.x) * kb;
    this.look.y += ((this.bias?.[1] ?? 0) - this.look.y) * kb;
    this.cam.x += (px + this.look.x - this.cam.x) * k;
    this.cam.y += (py + this.look.y - this.cam.y) * k;
    scene.followCamera(this.cam);
    return true;
  }

  stepCart(cart, dt) {
    if (cart.state === 'board') {
      cart.t += dt;
      if (cart.t < BOARD_SECONDS) return;
      cart.state = 'roll';
    }
    this.plan(cart);
    const leg = cart.leg;
    cart.v = Math.min(cart.cruise ?? CRUISE, cart.v + ACCEL * dt);
    if (cart.riders) this.rattle(cart, cart.v * dt);
    if (leg.stopS != null && !leg.bumper) {
      const left = leg.stopS - cart.s;
      cart.v = Math.min(cart.v, Math.sqrt(2 * BRAKE * Math.max(0, left)) + 12);
    }
    let move = cart.v * dt;
    for (let guard = 0; move > 0 && cart.state === 'roll'; guard++) {
      if (guard > 40) throw new Error(`cart ${cart.id} is going round in circles at ${cart.tx},${cart.ty} (s ${cart.s}, stop ${cart.leg.stopS}, move ${move})`);
      const l = cart.leg;
      const stop = l.stopS ?? l.len;
      const room = stop - cart.s;
      if (move < room - 0.001 && !(l.stopS != null && room < 0.4)) {
        cart.s += move;
        move = 0;
      } else {
        cart.s = stop;
        move -= room;
        // Rolling into a doorway through to the next room, even if it's the end of the line.
        if (l.doorAt != null && cart.s >= l.doorAt) {
          this.passDoor(cart);
          return;
        }
        if (l.stopS != null) {
          this.halt(cart);
          break;
        }
        if (!this.advance(cart)) break;
      }
    }
    if (cart.state === 'roll') {
      if (cart.leg.doorAt != null && cart.s >= cart.leg.doorAt) {
        this.passDoor(cart);
        return;
      }
      this.sync(cart);
      if (cart.leg.kind === 'curve' && Math.random() < 0.55) this.sparks(cart);
      // With riders it throws more sparks: round the bends, and over a switch.
      if (cart.riders && cart.v > 40 && Math.random() < 0.5 && (cart.leg.kind === 'curve' || this.pieceAt(cart.tx, cart.ty)?.arms.length === 3)) this.sparks(cart);
    }
  }

  // On to the next tile. False if the cart stopped instead.
  advance(cart) {
    const leg = cart.leg;
    const [dx, dy] = DIRS[leg.out];
    const nx = cart.tx + dx;
    const ny = cart.ty + dy;
    const block = this.blocker(cart, nx, ny);
    if (block && !block.smash) {
      cart.s = leg.len / 2;
      this.halt(cart);
      return false;
    }
    if (block?.smash) {
      this.breakProp(block.smash);
      this.save();
    }
    cart.tx = nx;
    cart.ty = ny;
    const piece = this.pieceAt(nx, ny);
    const into = OPP[leg.out];
    let out = this.exitFor(piece, into);
    this.springSet(piece, into);
    const bumper = out == null;
    if (bumper) out = OPP[into];
    cart.leg = makeLeg(into, out);
    cart.leg.bumper = bumper;
    cart.s = 0;
    cart.dir = out;
    sfx(cart.leg.kind === 'curve' ? 'creak' : 'move');
    // A ride leans into a bend or a switch: a jolt, and a flick of sparks.
    if (cart.riders && (cart.leg.kind === 'curve' || piece?.arms.length === 3)) {
      this.scene.shakeCamera(1, 0.14);
      for (let i = 0; i < 3; i++) this.sparks(cart);
    }
    this.plan(cart);
    if (cart.riders && this.data.ride) this.rideBeats(cart);
    return true;
  }

  // A spring junction a cart comes into by a branch is thrown to that branch.
  springSet(piece, into) {
    if (!piece.spring || into === piece.stem) return;
    if (piece.branches.indexOf(into) !== this.stateOf(piece)) this.room.flipLever(piece.name);
  }

  // The cart comes to rest on its tile.
  halt(cart) {
    const bumped = cart.leg?.bumper;
    const riders = cart.riders;
    cart.v = 0;
    cart.state = 'rest';
    cart.leg = null;
    cart.s = 0;
    cart.prop.x = cart.tx * T;
    cart.prop.y = cart.ty * T;
    this.restLook(cart);
    if (bumped) {
      sfx('hit');
      this.scene.shakeCamera(riders ? 2 : 1, 0.2);
      cart.recoil = 0.22;
      for (let i = 0; i < 4; i++) this.burst('dust_b', cart.prop.x + T / 2 + DIRS[cart.dir][0] * 6, cart.prop.y + T - 3, 24, 0.5);
    } else {
      sfx('back');
    }
    if (riders) this.dismount(cart);
    cart.riders = false;
    this.settle();
    this.save();
  }

  settle() {
    this.scene.rockSettled();
    this.scene.settleTreadles();
  }

  // Rider's seat: the player rides at the cart's middle.
  sync(cart) {
    const { leg } = cart;
    const [lx, ly] = legPoint(leg, cart.s);
    const [hx, hy] = legHeading(leg, cart.s);
    const wx = cart.tx * T + lx;
    const wy = cart.ty * T + ly;
    cart.prop.x = Math.round(wx - T / 2);
    cart.prop.y = Math.round(wy - T / 2);
    cart.heading = [hx, hy];
    const side = Math.abs(hx) >= Math.abs(hy);
    const look = side ? 'mine_cart' : 'mine_cart_v';
    if (cart.prop.look !== look) cart.prop.setLook(look);
    if (cart.riders) {
      const { player } = this.scene;
      player.x = wx;
      player.y = wy + T / 2;
      player.facing = side ? (hx > 0 ? 'right' : 'left') : (hy > 0 ? 'down' : 'up');
    }
  }

  // Off the cart: onto the nearest open floor, away from anything that bites.
  dismount(cart) {
    const { scene } = this;
    const { player, room } = scene;
    const [hx, hy] = DIRS[cart.dir];
    const options = [[-hy, hx], [hy, -hx], [-hx, -hy], [hx, hy], [-hy - hx, hx - hy], [hy - hx, -hx - hy], [-hy + hx, hx + hy], [hy + hx, -hx + hy]];
    const free = (tx, ty) => {
      const x = tx * T + T / 2;
      const y = (ty + 1) * T;
      return !player.collidesAt(room, x, y) && player.floorAt(room, x, y) === 0 && !this.doorAt(tx, ty)
        && !scene.npcs.some((npc) => Math.hypot(npc.x - x, npc.y - y) < 26);
    };
    const spot = options.map(([ox, oy]) => [cart.tx + ox, cart.ty + oy]).find(([tx, ty]) => free(tx, ty));
    if (spot) {
      player.x = spot[0] * T + T / 2;
      player.y = (spot[1] + 1) * T;
      const ox = cart.tx - spot[0];
      const oy = cart.ty - spot[1];
      player.facing = Math.abs(ox) >= Math.abs(oy) ? (ox > 0 ? 'right' : 'left') : (oy > 0 ? 'down' : 'up');
      // Standing right up against the cart (below it, that's a few pixels up), so Z works at once.
      if (oy < 0 && ox === 0) player.y -= 8;
    } else {
      player.x = cart.tx * T + T / 2;
      player.y = (cart.ty + 1) * T;
    }
    player.hidden = false;
    player.moving = false;
    player.ground = 0;
    scene.unstick();
    for (const f of cart.followers) {
      f.hidden = false;
      f.warpTo(player.x, player.y);
    }
    cart.followers = [];
    // Anything lurking nearby holds off a moment: hopping out is never a fight.
    for (const npc of scene.npcs) if (Math.hypot(npc.x - player.x, npc.y - player.y) < 70) npc.startCooldown?.();
    this.riding = null;
    this.cam = null;
    cart.cruise = null;
    this.endRide();
  }

  // Whatever a set-piece ride put on is put away (the planks were never gone).
  endRide() {
    this.bias = null;
    this.look = null;
    this.gone.clear();
    this.caption = null;
  }

  // A cart with riders has rolled into a doorway: through they go.
  passDoor(cart) {
    const door = this.doorAt(cart.tx, cart.ty);
    cart.state = 'door';
    cart.v = 0;
    this.sync(cart);
    this.rideInfo = { dir: cart.dir };
    cart.cruise = null;
    this.endRide();
    this.scene.doorway = { door, t: 0 };
    sfx('door');
    this.save();
  }

  // Arriving in a cart through a door: a cart on the spawn's rail, rolling on.
  arrive(info) {
    const { scene } = this;
    const { player } = scene;
    const tx = Math.floor(player.x / T);
    const ty = Math.floor((player.y - 1) / T);
    const piece = this.pieceAt(tx, ty);
    if (!piece) throw new Error(`${this.data.id}: arrived in a cart at ${tx},${ty}, but there's no rail there`);
    let cart = this.carts.find((c) => c.tx === tx && c.ty === ty && c.state === 'rest');
    if (!cart) cart = this.makeCart(tx, ty, 'ride');
    this.place(cart, tx, ty);
    const arms = [...piece.arms];
    const out = arms.includes(info.dir) ? info.dir : arms.find((a) => a !== OPP[info.dir]) ?? arms[0];
    scene.unstick();
    player.x = tx * T + T / 2;
    player.y = (ty + 1) * T;
    player.facing = FACING[out];
    scene.cameraSnap?.();
    if (!this.startRoll(cart, out, true)) {
      this.restLook(cart);
      return;
    }
    // A moment to take in the new room before it rolls on.
    cart.t = -0.45;
  }

  // --- Particles ---

  burst(kind, x, y, speed, life) {
    const a = Math.random() * Math.PI * 2;
    const v = speed * (0.3 + Math.random() * 0.7);
    this.fx.push({ kind, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.5, life: life * (0.6 + Math.random() * 0.6), age: 0, grav: 220 });
  }

  // The wheels going over the joints in the rail: a pair of clacks (front
  // wheels, back wheels) every two tiles' length, a rhythm that quickens with the speed.
  rattle(cart, dist) {
    const before = (cart.run ?? 0) % 32;
    cart.run = (cart.run ?? 0) + dist;
    const now = cart.run % 32;
    if (now < before) sfx('clack');
    else if (before < 7 && now >= 7) sfx('clack2');
  }

  // A set-piece ride's moments (the room's `ride` field, see the top of this file).
  rideBeats(cart) {
    const ride = this.data.ride;
    const [dx, dy] = DIRS[cart.dir];
    const cx = cart.prop.x + T / 2;
    const cy = cart.prop.y + T / 2;
    // The planks drop away three tiles behind, into the black.
    if (ride.crumble) {
      const gx = cart.tx - dx * 3;
      const gy = cart.ty - dy * 3;
      if (this.data.tiles[gy]?.[gx] === 'g' && !this.gone.has(`${gx},${gy}`)) {
        this.gone.add(`${gx},${gy}`);
        for (let i = 0; i < 5; i++) this.burst(i % 2 ? 'splinter_a' : 'splinter_b', gx * T + 8, gy * T + 8, 40, 1.4);
        for (let i = 0; i < 2; i++) this.burst('dust_a', gx * T + 8, gy * T + 8, 20, 0.8);
        if (this.gone.size % 3 === 1) sfx('crumble');
      }
    }
    for (const beat of ride.beats ?? []) {
      if (beat.at[0] !== cart.tx || beat.at[1] !== cart.ty || (beat.dir && beat.dir !== cart.dir)) continue;
      if ('cruise' in beat) cart.cruise = beat.cruise;
      if ('bias' in beat) this.bias = beat.bias;
      if (beat.shake) this.scene.shakeCamera(...beat.shake);
      for (const name of [beat.sfx ?? []].flat()) sfx(name);
      for (let i = 0; i < (beat.sparks ?? 0); i++) this.sparks(cart);
      for (let i = 0; i < (beat.dust ?? 0); i++) this.burst('dust_b', cx, cy + 6, 40, 0.6);
      for (let i = 0; i < (beat.bats ?? 0); i++) this.addBat(cx, cy, dx, dy);
      if (beat.line) this.sayLine(cart, ride);
    }
  }

  // A bat out of the dark: it bursts up from below and flaps off ahead of the cart.
  addBat(cx, cy, dx, dy) {
    this.bats.push({
      x: cx + (Math.random() - 0.5) * 120, y: cy + 90 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 50 + dx * 34, vy: -(70 + Math.random() * 60),
      age: 0, life: 2.2 + Math.random() * 0.8, phase: Math.random() * 6,
    });
  }

  // Ves, over the ride, once: only if she is riding along.
  sayLine(cart, ride) {
    WORLD_STATE.rideLines ??= [];
    if (!ride.line || WORLD_STATE.rideLines.includes(this.data.id)) return;
    if (!cart.followers.some((f) => f.id === VES)) return;
    const text = textSection(ride.lineText, ride.line)?.[0]?.replace(/\{[^}]*\}/g, '').trim();
    if (!text) return;
    WORLD_STATE.rideLines.push(this.data.id);
    this.caption = { text, left: 3.4, total: 3.4 };
  }

  sparks(cart) {
    const x = cart.prop.x + T / 2 + (Math.random() * 6 - 3);
    const y = cart.prop.y + T - 3;
    const kinds = ['spark_a', 'spark_a', 'spark_b', 'spark_c'];
    this.fx.push({ kind: kinds[Math.floor(Math.random() * kinds.length)], x, y, vx: (Math.random() - 0.5) * 60, vy: -30 - Math.random() * 40, life: 0.25 + Math.random() * 0.2, age: 0, grav: 260 });
  }

  updateFx(dt) {
    for (const p of this.fx) {
      p.age += dt;
      p.vy += p.grav * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.98;
    }
    this.fx = this.fx.filter((p) => p.age < p.life);
    for (const b of this.bats) {
      b.age += dt;
      b.x += b.vx * dt + Math.sin(b.age * 5 + b.phase) * 0.6;
      b.y += b.vy * dt;
      b.vy += 38 * dt;
    }
    this.bats = this.bats.filter((b) => b.age < b.life);
  }

  // --- Drawing ---

  // The track, flat on the floor under everything.
  drawFloor(ctx, camera) {
    if (!this.grid.size) return;
    const x0 = Math.max(0, Math.floor(camera.x / T));
    const y0 = Math.max(0, Math.floor(camera.y / T));
    const x1 = Math.min(this.room.width - 1, Math.floor((camera.x + SCREEN_WIDTH) / T));
    const y1 = Math.min(this.room.height - 1, Math.floor((camera.y + SCREEN_HEIGHT) / T));
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const piece = this.pieceAt(tx, ty);
        if (!piece) continue;
        let options;
        if (piece.arms.length === 3) {
          const to = this.branchNow(piece);
          options = { arms: piece.arms, route: [piece.stem, to], arrow: piece.name ? to : null };
        } else if (piece.arms.length === 1) {
          options = { arms: piece.arms, stub: true };
        } else {
          options = { arms: piece.arms };
        }
        ctx.drawImage(cachedTile(options), tx * T - camera.x, ty * T - camera.y);
        if (this.gone.has(`${tx},${ty}`)) {
          ctx.fillStyle = '#050309';
          ctx.fillRect(tx * T - camera.x, ty * T - camera.y, T, T);
        }
      }
    }
  }

  // A cart: as any prop, but with riders sitting in it when it has them.
  drawCart(cart, ctx, camera) {
    const prop = cart.prop;
    if (prop.hidden) return;
    let cam = camera;
    if (cart.state === 'roll' && Math.floor(this.time * 26) % 2) cam = { x: camera.x, y: camera.y + 1 };
    if (cart.recoil > 0 && cart.dir) {
      const [dx, dy] = DIRS[cart.dir];
      const back = Math.round(Math.sin((cart.recoil / 0.22) * Math.PI) * 2);
      cam = { x: camera.x + dx * back, y: camera.y + dy * back };
    }
    if (!cart.riders) {
      Prop.prototype.draw.call(prop, ctx, cam);
      return;
    }
    const frame = prop.sprite;
    const back = CART_BACK_ROWS[prop.look] ?? 6;
    const x = prop.x + Math.floor((prop.width - frame.width) / 2) - cam.x;
    const y = prop.y + T - frame.height - cam.y;
    ctx.drawImage(frame, 0, 0, frame.width, back, x, y, frame.width, back);
    const side = prop.look === 'mine_cart';
    const heading = cart.heading ?? [1, 0];
    const look = side ? (heading[0] >= 0 ? 'right' : 'left') : (heading[1] >= 0 ? 'down' : 'up');
    const sign = side ? (heading[0] >= 0 ? 1 : -1) : 1;
    const centre = prop.x + T / 2 - cam.x;
    const feet = prop.y + T - 4 - cam.y;
    const seat = (image, dx, dy = 0) => ctx.drawImage(image, Math.round(centre + dx - image.width / 2), Math.round(feet + dy - image.height));
    const { player } = this.scene;
    const was = player.moving;
    player.moving = false;
    const you = () => seat(player.currentFrame(look), side ? 3 * sign : -2, side ? 0 : look === 'up' ? -3 : 0);
    // Whoever's riding with you sits behind you. Side on, that's beside you;
    // going up or down the screen the cart is narrow, so it's in line: going
    // down they're further up the cart (drawn first), going up further down
    // it (drawn over you, nearer the camera). With all three aboard Bramble
    // doesn't sit: he hangs on to the back, legs flailing in the wind.
    const hanger = cart.followers.length > 1 && cart.followers.some((f) => f.id === 'vesper') ? cart.followers.find((f) => f.id === 'bramble') : null;
    const sitters = cart.followers.filter((f) => f !== hanger);
    const flail = (name) => animationFrame(name, this.time * 9, 1);
    if (hanger && look === 'down') {
      // Out beyond the cart's far corner, one hand on the rim, the rest of him streaming away.
      const image = flail('finale_bramble_cart_down');
      ctx.drawImage(image, Math.round(centre - image.width / 2) - 11, Math.round(y + 8 - image.height));
    }
    if (side || look === 'down') {
      for (const f of sitters) seat(f.frameLooking(look), side ? -7 * sign : 4, side ? 0 : -3);
      you();
    } else {
      you();
      for (const f of sitters) seat(f.frameLooking(look), 4, 0);
    }
    player.moving = was;
    ctx.drawImage(frame, 0, back, frame.width, frame.height - back, x, y + back, frame.width, frame.height - back);
    if (hanger && look === 'up') {
      const image = flail('finale_bramble_cart_up');
      ctx.drawImage(image, Math.round(centre - image.width / 2), Math.round(y + 9));
    } else if (hanger && side) {
      const image = flail('finale_bramble_cart_side');
      if (sign > 0) ctx.drawImage(image, x - 27, y - 3);
      else {
        ctx.save();
        ctx.translate(x + frame.width + 27, y - 3);
        ctx.scale(-1, 1);
        ctx.drawImage(image, 0, 0);
        ctx.restore();
      }
    }
  }

  // Streaks of speed past a moving ride: faint lines flying back the way the
  // cart came, keeping clear of the cart itself.
  drawSpeedLines(ctx, camera) {
    const cart = this.riding;
    if (!cart || cart.state !== 'roll' || cart.v < 40 || !cart.heading) return;
    const [hx, hy] = cart.heading;
    const horizontal = Math.abs(hx) >= Math.abs(hy);
    const dir = horizontal ? Math.sign(hx) || 1 : Math.sign(hy) || 1;
    const sx = cart.prop.x + T / 2 - camera.x;
    const sy = cart.prop.y + T / 2 - camera.y;
    const power = Math.min(1, (cart.v - 40) / 64);
    const span = (horizontal ? SCREEN_WIDTH : SCREEN_HEIGHT) + 60;
    ctx.save();
    for (let i = 0; i < 12; i++) {
      const lane = (i * 53.7 + 11) % (horizontal ? SCREEN_HEIGHT : SCREEN_WIDTH);
      const length = 8 + ((i * 17) % 13) + cart.v * 0.12;
      const along = ((((i * 91) % span) - dir * this.time * (cart.v * 2.4 + (i % 4) * 18)) % span + span) % span - 30;
      const x = horizontal ? along : lane;
      const y = horizontal ? lane : along;
      // Nothing right over the cart and the rails it's on.
      if (Math.abs(x - sx) < 24 + (horizontal ? length : 0) && Math.abs(y - sy) < 20 + (horizontal ? 0 : length)) continue;
      ctx.fillStyle = `rgba(220, 205, 180, ${(0.16 * power).toFixed(3)})`;
      if (horizontal) ctx.fillRect(Math.round(x), Math.round(y), Math.round(length), 1);
      else ctx.fillRect(Math.round(x), Math.round(y), 1, Math.round(length));
    }
    ctx.restore();
  }

  drawFx(ctx, camera) {
    this.drawSpeedLines(ctx, camera);
    for (const b of this.bats) {
      const image = batSprites[Math.floor(b.age * 11 + b.phase) % 2];
      ctx.globalAlpha = Math.min(1, (b.life - b.age) * 2);
      ctx.drawImage(image, Math.round(b.x - camera.x - image.width / 2), Math.round(b.y - camera.y - image.height / 2));
    }
    ctx.globalAlpha = 1;
    for (const p of this.fx) {
      const image = fxSprites[p.kind];
      ctx.globalAlpha = Math.min(1, (1 - p.age / p.life) * 1.6);
      ctx.drawImage(image, Math.round(p.x - camera.x - image.width / 2), Math.round(p.y - camera.y - image.height / 2));
    }
    ctx.globalAlpha = 1;
    if (this.caption) this.drawCaption(ctx);
  }

  // Ves's line, over the ride, along the bottom (nothing stops for it).
  drawCaption(ctx) {
    const { text, left, total } = this.caption;
    const alpha = Math.min(1, left * 3, (total - left) * 3);
    inUiSpace(ctx, () => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(40, 404, 560, 44);
      drawText(ctx, text, 320, 412, { size: 26, color: '#e6dcff', align: 'center', outline: '#000' });
      ctx.globalAlpha = 1;
    });
  }

  // --- For the preview's play scripts ---

  get busy() {
    return Boolean(this.riding) || this.carts.some((c) => c.state === 'roll' || c.state === 'board' || c.state === 'door') || Boolean(this.scene.doorway);
  }

  cartById(id) {
    return this.carts.find((c) => c.id === id) ?? null;
  }
}
