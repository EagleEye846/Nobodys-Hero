// THE TIDE ENGINE (Chapter 5). A room with a `tide` field has two maps of the
// same size: its `tiles` are the HIGH-tide map, `tide.low` the LOW-tide one.
// The tide swaps tiles from one map to the other, a few at a time, so the
// water's edge creeps in or out over a second or two. The engine never says
// what a tile looks like: it changes which tile LETTER is where, and the tile
// set draws it. Read "The tide engine" in notes/docs/chapter-5-builders-guide.md.
//
// Two classes:
//   RoomTide  lives in a Room (room.tide): the two maps, both backgrounds, the
//             creep, the waiting for bodies, floating crates.
//   Tides     lives in the OverworldScene (scene.tides): the clock, the wheels
//             and bells, sounds, the gauge, the dial, pushing people to safety.
import { TILE_SIZE as T } from '../config.js';
import { TILES } from './tileset.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { sfx } from '../audio/music.js';
import { inParty } from '../characters/party.js';
import { textSection } from '../engine/textLoader.js';
import { drawText } from '../ui/text.js';
import { inUiSpace } from '../engine/screen.js';
import { registerPropSprite } from './prop.js';

const DEFAULT_CREEP = 1.8;
// How far a tile that must wait for someone standing on it gets (of its fade).
const HELD_AT = 0.45;
// Seconds a tide waits for someone to step off before it moves them.
const DEFAULT_WAIT = 3;
// Letters a settling crate sinks into at low tide: still water, bog, fen water.
const DEFAULT_SINKS = '~%$';
const OTHER = { high: 'low', low: 'high' };

const hash = (x, y) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

// Mistakes in a room's `tide` field, as a list of sentences (for ?check=1).
export function tideProblems(data) {
  const out = [];
  const cfg = data.tide;
  if (!cfg) return out;
  const same = cfg.same ?? ' ';
  if (!Array.isArray(cfg.low)) return ['tide.low must be a list of rows'];
  if (cfg.low.length !== data.tiles.length) out.push(`tide.low has ${cfg.low.length} rows, tiles has ${data.tiles.length}`);
  cfg.low.forEach((row, y) => {
    if (row.length !== data.tiles[y]?.length) out.push(`tide.low row ${y} is ${row.length} wide, tiles row is ${data.tiles[y]?.length}`);
    [...row].forEach((c, x) => {
      if (c !== same && !TILES[c]) out.push(`tide.low has unknown tile '${c}' at ${x},${y}`);
    });
  });
  if (cfg.start && !OTHER[cfg.start]) out.push(`tide.start must be 'high' or 'low', not '${cfg.start}'`);
  if (cfg.clock) {
    for (const key of ['high', 'low']) if (!(cfg.clock[key] > 0)) out.push(`tide.clock.${key} must be a number of seconds`);
    if ((cfg.clock.warn ?? 3) >= Math.min(cfg.clock.high, cfg.clock.low)) out.push('tide.clock.warn must be shorter than both phases');
  }
  for (const p of data.props.filter((q) => q.tideWheel || q.tideBell)) {
    const spec = p.tideWheel ?? p.tideBell;
    const to = typeof spec === 'string' ? spec : (spec.to ?? spec.call ?? 'toggle');
    if (!['high', 'low', 'toggle'].includes(to)) out.push(`tide control at ${p.x},${p.y}: '${to}' is not high, low or toggle`);
  }
  if (cfg.clock && cfg.hud === false && !data.props.some((p) => p.tideDial)) out.push('tide.clock has no dial prop and hud is off: the player cannot see the clock');
  return out;
}

export class RoomTide {
  constructor(room, data) {
    const cfg = data.tide;
    const problems = tideProblems(data);
    if (problems.length) throw new Error(`tide: ${problems.join('; ')}`);
    this.room = room;
    this.cfg = cfg;
    this.group = cfg.group ?? `room:${data.id}`;
    this.start = cfg.start ?? 'high';
    this.creep = cfg.creep ?? DEFAULT_CREEP;
    this.wait = cfg.wait ?? DEFAULT_WAIT;
    this.sinkChars = new Set([...(cfg.sinks ?? DEFAULT_SINKS)]);
    this.waterChars = new Set([...(cfg.water ?? '')]);
    const same = cfg.same ?? ' ';
    this.high = data.tiles.map((row) => [...row]);
    this.low = cfg.low.map((row, y) => [...row].map((c, x) => (c === same ? this.high[y][x] : c)));
    this.width = this.high[0].length;
    this.height = this.high.length;
    // Tiles that differ between the two maps.
    this.changing = new Set();
    this.high.forEach((row, y) => row.forEach((c, x) => { if (c !== this.low[y][x]) this.changing.add(`${x},${y}`); }));
    // What the tide is now (the target, while it creeps): the group's saved state.
    this.state = WORLD_STATE.tides?.[this.group] ?? this.start;
    this.cur = this.map(this.state).map((row) => [...row]);
    this.anim = null;
    // Seconds since the last tile landed, to look after stragglers (Tides.update).
    this.sinceDone = 99;
    // Set when something changed: Tides plays the sound and restarts the clock.
    this.changedBy = null;
  }

  map(state) {
    return state === 'high' ? this.high : this.low;
  }

  // The rows the room starts with.
  currentRows() {
    return this.cur.map((row) => row.join(''));
  }

  get busy() {
    return Boolean(this.anim);
  }

  // --- Looks: both backgrounds are drawn once, and the live one blends them ---
  renderBackgrounds() {
    const room = this.room;
    const keep = room.tiles;
    const draw = (map) => {
      room.tiles = map.map((row) => row.join(''));
      return room.renderBackground();
    };
    this.bg = { high: draw(this.high), low: draw(this.low) };
    room.tiles = keep;
    this.live = document.createElement('canvas');
    this.live.width = room.pixelWidth;
    this.live.height = room.pixelHeight;
    this.paintLive();
    return this.live;
  }

  paintLive() {
    const ctx = this.live.getContext('2d');
    ctx.globalAlpha = 1;
    const a = this.anim;
    if (!a) {
      ctx.drawImage(this.bg[this.state], 0, 0);
      return;
    }
    ctx.drawImage(this.bg[OTHER[a.to]], 0, 0);
    for (const c of a.tiles) {
      if (c.kind !== 'tile' || c.shown <= 0) continue;
      ctx.globalAlpha = Math.min(1, c.shown);
      ctx.drawImage(this.bg[a.to], c.tx * T, c.ty * T, T, T, c.tx * T, c.ty * T, T, T);
    }
    ctx.globalAlpha = 1;
  }

  // --- Starting a change ---
  // Sends the tide to 'high' or 'low' (saved at once; the water creeps after).
  // Returns whether anything started.
  begin(to) {
    if (this.state === to && !this.anim) return false;
    if (this.anim && this.anim.to === to) return false;
    WORLD_STATE.tides ??= {};
    WORLD_STATE.tides[this.group] = to;
    const old = this.anim;
    this.state = to;
    const target = this.map(to);
    const tiles = [];
    const seen = new Set();
    const add = (entry) => { seen.add(`${entry.tx},${entry.ty}`); tiles.push(entry); };
    // Tiles whose letter must change, and ones from a change we turned back
    // half way (their picture is part way over already).
    const oldAt = new Map((old?.tiles ?? []).map((c) => [`${c.tx},${c.ty}`, c]));
    for (let ty = 0; ty < this.height; ty++) {
      for (let tx = 0; tx < this.width; tx++) {
        const key = `${tx},${ty}`;
        const wasHere = oldAt.get(key);
        if (this.cur[ty][tx] === target[ty][tx] && !(wasHere && wasHere.kind === 'tile' && wasHere.shown > 0)) continue;
        add({ kind: 'tile', tx, ty, to: target[ty][tx], shown: wasHere?.kind === 'tile' ? 1 - Math.min(1, wasHere.shown) : 0, delay: 0, held: 0 });
      }
    }
    // Neighbours of a changed tile fade with it, so no shore edge pops at the end.
    const base = tiles.slice();
    for (const c of base) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = c.tx + dx;
          const ny = c.ty + dy;
          if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height || seen.has(`${nx},${ny}`)) continue;
          add({ kind: 'fade', tx: nx, ty: ny, to: this.cur[ny][nx], shown: 0, delay: 0, held: 0, link: c });
        }
      }
    }
    // Sunk crates on tiles that don't change: they come back up with the tide.
    if (to === 'high') {
      for (const crate of this.crates()) {
        const key = `${crate.x / T},${crate.y / T}`;
        if (crate.sunk && !seen.has(key)) add({ kind: 'crate', tx: crate.x / T, ty: crate.y / T, to: this.cur[crate.y / T][crate.x / T], shown: 1, delay: 0, held: 0 });
      }
    }
    if (!tiles.length) {
      this.anim = null;
      this.settleCrates();
      this.changedBy = to;
      return true;
    }
    this.spread(tiles, to);
    this.anim = { to, t: 0, tiles };
    this.changedBy = to;
    return true;
  }

  // Works out when each tile starts: out from the permanent water when it
  // rises, out from the shore when it ebbs.
  spread(tiles, to) {
    const dist = new Map();
    const queue = [];
    const rising = to === 'high';
    for (let ty = 0; ty < this.height; ty++) {
      for (let tx = 0; tx < this.width; tx++) {
        if (this.changing.has(`${tx},${ty}`)) continue;
        const solid = TILES[this.cur[ty][tx]]?.solid;
        if (rising ? solid : !solid) { dist.set(`${tx},${ty}`, 0); queue.push([tx, ty]); }
      }
    }
    for (let i = 0; i < queue.length; i++) {
      const [x, y] = queue[i];
      const d = dist.get(`${x},${y}`);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height || dist.has(key)) continue;
        dist.set(key, d + 1);
        queue.push([nx, ny]);
      }
    }
    const real = tiles.filter((c) => c.kind !== 'fade');
    const far = Math.max(1, ...real.map((c) => dist.get(`${c.tx},${c.ty}`) ?? (c.tx + c.ty) % 6));
    for (const c of real) {
      const d = dist.get(`${c.tx},${c.ty}`) ?? (c.tx + c.ty) % 6;
      c.delay = ((Math.max(1, d) - 1) / far) * this.creep * 0.55 + hash(c.tx, c.ty) * this.creep * 0.15;
    }
    for (const c of tiles.filter((t) => t.kind === 'fade')) c.delay = c.link.delay;
    this.fade = this.creep * 0.35;
  }

  // --- Floating crates ---
  crates() {
    return this.room.allProps.filter((p) => p.float && p.rock && !p.made);
  }

  // Whether a floating crate may be pushed onto tile (tx, ty) right now:
  // 'float' on the water at high tide, 'sink' into a trench at low tide.
  crateCan(tx, ty) {
    if (this.anim) return false;
    const ch = this.cur[ty]?.[tx];
    if (ch === undefined || this.room.bridged.has(`${tx},${ty}`)) return false;
    if (this.state === 'high') return this.floatsAt(tx, ty) ? 'float' : false;
    return this.sinkChars.has(ch) && TILES[ch].solid ? 'sink' : false;
  }

  // Water at high tide that a crate floats on: any solid tile that the tide
  // takes away, still water that goes to a trench at low, or `water` letters.
  floatsAt(tx, ty) {
    if (this.anim || this.state !== 'high') return false;
    const ch = this.cur[ty]?.[tx];
    if (ch === undefined || !TILES[ch].solid || this.room.bridged.has(`${tx},${ty}`)) return false;
    return this.changing.has(`${tx},${ty}`) || this.waterChars.has(ch) || this.sinkChars.has(ch);
  }

  sinkCrate(crate) {
    const key = `${crate.x / T},${crate.y / T}`;
    crate.sunk = true;
    crate.walkable = true;
    crate.floating = false;
    crate.setLook(`${crate.baseLook}_sunk`);
    this.room.bridged.add(key);
    this.room.bridgeLooks.set(key, crate.baseLook);
  }

  floatCrate(crate) {
    const key = `${crate.x / T},${crate.y / T}`;
    crate.sunk = false;
    crate.walkable = false;
    crate.setLook();
    this.room.bridged.delete(key);
    this.room.bridgeLooks.delete(key);
  }

  // Crates sink into a trench at low tide and rise again at high. Called once
  // the water has settled (and when a room is built or reset).
  settleCrates() {
    for (const crate of this.crates()) {
      if (crate.slide) continue;
      const tx = crate.x / T;
      const ty = crate.y / T;
      const ch = this.cur[ty]?.[tx];
      if (!crate.sunk && this.state === 'low' && this.sinkChars.has(ch) && TILES[ch]?.solid) this.sinkCrate(crate);
      else if (crate.sunk && this.state === 'high' && !this.anim) this.floatCrate(crate);
      crate.floating = !crate.sunk && this.floatsAt(tx, ty);
    }
  }

  // Back to how the room starts (the reset stump). The water creeps there.
  resetToStart() {
    this.begin(this.start);
    this.settleCrates();
  }

  // --- Each frame ---
  // `bodies` are everyone who stands in the room ({ x, y } at the feet). Returns the
  // ones who've been standing in the way too long, as { body, tx, ty }.
  update(dt, bodies) {
    const a = this.anim;
    if (!a) {
      this.sinceDone += dt;
      return [];
    }
    a.t += dt;
    const stuck = [];
    const blockedAt = (tx, ty) => bodies.some((b) => Math.floor(b.x / T) === tx && Math.floor((b.y - 1) / T) === ty)
      || this.room.allProps.some((p) => (p.rock || p.log) && !p.float && !p.sunk && !p.hidden && p.x === tx * T && p.y === ty * T);
    let done = true;
    let flipped = false;
    for (const c of a.tiles) {
      if (c.kind === 'fade') {
        c.shown = Math.max(c.shown, Math.min(1, (a.t - c.delay) / this.fade));
        if (c.shown < 1) done = false;
        continue;
      }
      const wants = c.kind === 'tile' ? this.cur[c.ty][c.tx] !== c.to : this.room.bridged.has(`${c.tx},${c.ty}`);
      const rise = Math.min(1, Math.max(0, (a.t - c.delay) / this.fade));
      if (c.kind === 'tile') c.shown = Math.max(c.shown, rise);
      if (!wants) {
        if (c.kind === 'tile' && c.shown < 1) done = false;
        continue;
      }
      done = false;
      if (a.t < c.delay) continue;
      // Becoming water under somebody: the water waits at its edge.
      const solidAfter = TILES[c.to].solid;
      if (solidAfter && blockedAt(c.tx, c.ty)) {
        if (c.kind === 'tile') c.shown = Math.min(c.shown, HELD_AT);
        c.held += dt;
        if (c.held > this.wait) {
          const body = bodies.find((b) => Math.floor(b.x / T) === c.tx && Math.floor((b.y - 1) / T) === c.ty);
          if (body) stuck.push({ body, tx: c.tx, ty: c.ty });
        }
        continue;
      }
      if (c.kind === 'tile' && c.shown < 0.5) continue;
      c.held = 0;
      flipped = true;
      if (c.kind === 'tile') this.flip(c);
      else {
        const crate = this.crates().find((p) => p.x / T === c.tx && p.y / T === c.ty && p.sunk);
        if (crate) this.floatCrate(crate);
      }
    }
    if (flipped) this.room.standing = this.room.findStandingTiles();
    this.paintLive();
    if (done) {
      this.anim = null;
      this.sinceDone = 0;
      this.paintLive();
      this.settleCrates();
      this.room.standing = this.room.findStandingTiles();
    }
    return stuck;
  }

  flip(c) {
    this.cur[c.ty][c.tx] = c.to;
    const row = this.room.tiles[c.ty];
    this.room.tiles[c.ty] = row.slice(0, c.tx) + c.to + row.slice(c.tx + 1);
    // A crate sitting there: sinks into a trench, or floats up on the water.
    for (const crate of this.crates()) {
      if (crate.slide || crate.x !== c.tx * T || crate.y !== c.ty * T) continue;
      if (!crate.sunk && this.state === 'low' && this.sinkChars.has(c.to) && TILES[c.to].solid) this.sinkCrate(crate);
      else if (crate.sunk && TILES[c.to].solid && this.state === 'high') this.floatCrate(crate);
    }
  }

  // The nearest tile someone can stand on once the tide has done its work.
  safeTile(fromX, fromY) {
    const target = this.map(this.state);
    const free = (tx, ty) => {
      const ch = target[ty]?.[tx];
      if (ch === undefined || TILES[ch].solid || (TILES[ch].raise ?? 0) > 0) return false;
      const box = [tx * T + 2, ty * T + 2, (tx + 1) * T - 2, (ty + 1) * T - 2];
      return !this.room.props.some((p) => !p.walkable && p.overlaps(...box)) && !this.room.bridged.has(`${tx},${ty}`)
        && !this.room.doors.some((d) => tx >= d.x && tx < d.x + (d.w ?? 1) && ty >= d.y && ty < d.y + (d.h ?? 1));
    };
    const seen = new Set([`${fromX},${fromY}`]);
    const queue = [[fromX, fromY]];
    for (let i = 0; i < queue.length; i++) {
      const [x, y] = queue[i];
      if (free(x, y) && !this.changing.has(`${x},${y}`)) return { tx: x, ty: y };
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= this.width || ny >= this.height || seen.has(`${nx},${ny}`)) continue;
        seen.add(`${nx},${ny}`);
        queue.push([nx, ny]);
      }
    }
    // Everything nearby changes: take the nearest that's land in the end.
    return queue.map(([x, y]) => ({ tx: x, ty: y })).find((p) => free(p.tx, p.ty)) ?? null;
  }
}

// ---------------------------------------------------------------------------
// The tide dial: a post with a round face, a blue arc for the high-tide part of
// the cycle and a sandy arc for the low, and a hand that goes round. A room's
// `{ sprite: 'tide_dial', x, y, tideDial: true }` prop shows it. The engine
// repaints this one picture as the hand moves.
const DIAL_W = 16;
const DIAL_H = 28;
const dialCanvas = document.createElement('canvas');
dialCanvas.width = DIAL_W;
dialCanvas.height = DIAL_H;
registerPropSprite('tide_dial', dialCanvas);

let dialKey = '';
function paintDial(frac, highShare, warn, flashOn) {
  const key = `${Math.round(frac * 48)}|${Math.round(highShare * 48)}|${warn ? (flashOn ? 1 : 2) : 0}`;
  if (key === dialKey) return;
  dialKey = key;
  const ctx = dialCanvas.getContext('2d');
  ctx.clearRect(0, 0, DIAL_W, DIAL_H);
  const px = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
  // The post and its foot.
  px(7, 15, 2, 11, '#5a3d22');
  px(8, 15, 1, 11, '#44301a');
  px(5, 25, 6, 3, '#6b4a2b');
  px(5, 27, 6, 1, '#44301a');
  const cx = 7.5;
  const cy = 7.5;
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const r = Math.hypot(dx, dy);
      if (r > 7.6) continue;
      if (r > 6.4) { px(x, y, 1, 1, warn && flashOn ? '#d8503a' : '#3b2a18'); continue; }
      const turn = ((Math.atan2(dx, -dy) / (Math.PI * 2)) + 1) % 1;
      px(x, y, 1, 1, turn < highShare ? '#4a98c4' : '#dcc07a');
    }
  }
  // The hand.
  const angle = frac * Math.PI * 2;
  for (let s = 0; s <= 5; s += 0.5) {
    px(Math.round(cx + Math.sin(angle) * s), Math.round(cy - Math.cos(angle) * s), 1, 1, '#1c120a');
  }
  px(7, 7, 2, 2, warn ? '#d8503a' : '#1c120a');
}
paintDial(0, 0.5, false, false);

function lines(file, v) {
  if (Array.isArray(v)) return v;
  try {
    return textSection(file, v);
  } catch {
    return [v];
  }
}

export class Tides {
  constructor(scene) {
    this.scene = scene;
    this.rt = scene.room.tide ?? null;
    this.clockLeft = null;
    this.tickAt = null;
    this.warned = false;
    this.splashLater = 0;
    this.lastState = this.rt?.state ?? null;
    // Props with `lowTide: true` (a purse on the bed) only show while the tide is
    // out and still, so they never sit on top of the water. room.allProps is made
    // from the room's props in order, so the indexes line up.
    this.lowOnly = this.rt ? (scene.roomData.props ?? []).map((info, i) => (info.lowTide ? scene.room.allProps[i] : null)).filter(Boolean) : [];
    this.showLowOnly();
    if (this.rt) this.startPhase();
  }

  showLowOnly() {
    for (const p of this.lowOnly) p.hidden = this.rt.state !== 'low' || Boolean(this.rt.anim);
  }

  get active() {
    return Boolean(this.rt);
  }

  get clock() {
    return this.rt?.cfg.clock ?? null;
  }

  startPhase() {
    const clock = this.clock;
    this.clockLeft = clock ? clock[this.rt.state] : null;
    this.tickAt = null;
    this.warned = false;
  }

  bodies() {
    const s = this.scene;
    return [s.player, ...s.others, ...s.followers.filter((f) => !f.hidden)].filter(Boolean);
  }

  // Sends the tide where the author wants it. `group` other than this room's
  // only sets what that group will be when you get there.
  call(to, { group = null } = {}) {
    const rt = this.rt;
    const g = group ?? rt.group;
    const now = g === rt.group ? (rt.anim ? rt.anim.to : rt.state) : (WORLD_STATE.tides?.[g] ?? 'high');
    const want = to === 'toggle' ? OTHER[now] : to;
    if (g !== rt.group) {
      WORLD_STATE.tides ??= {};
      WORLD_STATE.tides[g] = want;
      return want;
    }
    rt.begin(want);
    return want;
  }

  update(dt) {
    const rt = this.rt;
    if (!rt) return;
    this.showLowOnly();
    const s = this.scene;
    if (rt.changedBy) {
      rt.changedBy = null;
      sfx('splash');
      this.splashLater = rt.creep * 0.5;
      this.startPhase();
    }
    if (this.splashLater > 0 && (this.splashLater -= dt) <= 0) sfx('splash');
    // The clock stops for words, scenes and doors.
    const paused = s.textbox.isOpen || s.cutscene || s.doorway || s.caught;
    const clock = this.clock;
    if (clock && !rt.busy && !paused) {
      this.clockLeft -= dt;
      const warn = clock.warn ?? 3;
      if (this.clockLeft <= warn) {
        this.warned = true;
        const tick = Math.ceil(this.clockLeft);
        if (this.tickAt !== tick && this.clockLeft > 0) {
          this.tickAt = tick;
          sfx('click');
        }
      }
      if (this.clockLeft <= 0) this.call('toggle');
    }
    for (const crate of rt.crates()) crate.floating = !crate.sunk && !crate.slide && rt.floatsAt(crate.x / T, crate.y / T);
    for (const p of s.room.props) if (p.tideWheel && p.shake > 0) p.shake = Math.max(0, p.shake - dt);
    const stuck = rt.update(dt, this.bodies());
    for (const { body, tx, ty } of stuck) this.pushOut(body, tx, ty);
    // A moment after the water settles, anyone left standing in it is lifted out
    // (a follower whose trail ran through a tile that flooded).
    if (rt.sinceDone < 1.2 && !rt.busy) this.rescue();
    this.freshenDials();
  }

  // Moves someone off a tile the tide is about to take, to the nearest dry one.
  pushOut(body, tx, ty) {
    const spot = this.rt.safeTile(tx, ty);
    if (!spot) return;
    const x = spot.tx * T + T / 2;
    const y = (spot.ty + 1) * T;
    const s = this.scene;
    if (body === s.player || s.others.includes(body)) {
      body.x = x;
      body.y = y;
      body.ground = 0;
      body.z = 0;
      if (body === s.player) s.unstick();
    } else body.warpTo(x, y);
    sfx('splash');
  }

  rescue() {
    const room = this.scene.room;
    for (const body of this.bodies()) {
      if (body.isAirborne || body.ground > 0) continue;
      const tx = Math.floor(body.x / T);
      const ty = Math.floor((body.y - 1) / T);
      if (room.isSolidTile(tx, ty) && TILES[room.tileAt(tx, ty)]?.solid) this.pushOut(body, tx, ty);
    }
  }

  // The dial's hand and the gauge need to know how far round the cycle is.
  cycle() {
    const clock = this.clock;
    if (!clock) return null;
    const total = clock.high + clock.low;
    const phase = this.rt.state;
    const elapsed = clock[phase] - Math.max(0, this.clockLeft ?? 0);
    const frac = ((phase === 'high' ? 0 : clock.high) + Math.min(clock[phase], elapsed)) / total;
    return { frac, highShare: clock.high / total, left: Math.max(0, this.clockLeft ?? 0) };
  }

  freshenDials() {
    const c = this.cycle();
    if (!c) return;
    const flash = Math.floor(performance.now() / 250) % 2 === 0;
    paintDial(c.frac, c.highShare, this.warned && !this.rt.busy, flash);
  }

  // Z on a dial, a wheel or a bell post. Returns whether it was one.
  use(prop) {
    const rt = this.rt;
    const s = this.scene;
    const say = (v, speaker) => s.textbox.open(lines(s.roomData.textFile, v), speaker ?? null);
    if (!rt) return false;
    if (prop.tideDial) {
      const c = this.cycle();
      const now = rt.anim ? rt.anim.to : rt.state;
      const note = c ? ` It turns in about ${Math.ceil(c.left)}.` : '';
      s.textbox.open([`The dial says the tide is ${now === 'high' ? 'HIGH' : 'LOW'}.${rt.anim ? ' It is moving.' : note}`]);
      return true;
    }
    const wheel = prop.tideWheel;
    const bell = prop.tideBell;
    const spec = wheel ?? bell;
    if (!spec) return false;
    const cfg = typeof spec === 'string' ? { to: spec } : spec;
    const to = cfg.to ?? cfg.call ?? 'toggle';
    if (cfg.needs && !inParty(cfg.needs)) {
      sfx('back');
      say(cfg.denied ?? 'The bell rope hangs just out of reach. It wants someone who knows the tide table.');
      return true;
    }
    if (rt.busy) {
      sfx('back');
      say(cfg.busy ?? (wheel ? 'The wheel will not budge while the water is moving.' : 'The water is still moving. It will not hear a bell yet.'));
      return true;
    }
    const was = rt.state;
    const own = !cfg.group || cfg.group === rt.group;
    const want = to === 'toggle' ? OTHER[was] : to;
    if (own && want === was) {
      sfx('select');
      say(cfg.already ?? (was === 'high' ? 'The tide is already as high as it goes.' : 'The tide is already out as far as it goes.'));
      return true;
    }
    sfx(wheel ? 'door' : 'bell');
    if (wheel) prop.shake = 0.5;
    this.call(want, { group: cfg.group ?? null });
    if (cfg.text) say(cfg.text);
    else if (!own) say('Far off, water starts to move.');
    return true;
  }

  // A small gauge in the top right: HIGH or LOW, the clock if there is one,
  // and a flashing warning before the turn. Drawn over the room.
  drawHud(ctx) {
    const rt = this.rt;
    if (!rt || rt.cfg.hud === false) return;
    const s = this.scene;
    if (s.cutscene) return;
    const c = this.cycle();
    const to = rt.anim ? rt.anim.to : rt.state;
    const warn = Boolean(c) && this.warned && !rt.busy;
    const flash = Math.floor(performance.now() / 250) % 2 === 0;
    inUiSpace(ctx, () => {
      const w = 150;
      const h = 34;
      const x = 640 - 16 - w;
      const y = s.roomData.dark ? 40 : 10;
      ctx.fillStyle = 'rgba(8, 16, 28, 0.72)';
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = warn && flash ? '#ff7a5c' : '#4a98c4';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
      const label = rt.anim ? (to === 'high' ? 'TIDE RISING' : 'TIDE FALLING') : `TIDE ${to === 'high' ? 'HIGH' : 'LOW'}`;
      drawText(ctx, label, x + 8, y + 3, { size: 20, color: warn && flash ? '#ff9a80' : '#bfe6ff', outline: '#000' });
      if (c) {
        const fill = rt.anim ? 1 : c.left / this.clock[rt.state];
        ctx.fillStyle = '#12304a';
        ctx.fillRect(x + 8, y + 24, w - 16, 5);
        ctx.fillStyle = warn ? '#ff7a5c' : (to === 'high' ? '#4a98c4' : '#dcc07a');
        ctx.fillRect(x + 8, y + 24, Math.round((w - 16) * Math.max(0, Math.min(1, fill))), 5);
      }
    });
  }

  // For the play script: one line saying how the tides stand.
  describe() {
    const rt = this.rt;
    if (!rt) return '';
    const c = this.cycle();
    return `tide ${rt.group} ${rt.anim ? `-> ${rt.anim.to} (creeping)` : rt.state}${c ? ` clock ${c.left.toFixed(1)}s` : ''} crates ${rt.crates().map((p) => `${p.x / T},${p.y / T}${p.sunk ? '(sunk)' : p.floating ? '(afloat)' : ''}`).join(' ')}`;
  }
}
