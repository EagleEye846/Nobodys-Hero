import { TILE_SIZE as T } from '../config.js';
import { TILES } from './tileset.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { sfx } from '../audio/music.js';
import { textSection } from '../engine/textLoader.js';
import { makeSprite } from '../engine/sprite.js';
import { PROP_PALETTE, PROP_SPRITES } from '../data/art/props.js';
import { isHurt, setHurt } from '../characters/party.js';

// THE LIGHT BEAMS (Chapter 4: the Glimmering and on).
//
// A sun-crystal (a prop with `beam: 'right'`, 'left', 'up' or 'down') throws a
// bright beam in a straight line, a tile at a time. A prism (`mirror: '/'` or
// '\\') turns it 90 degrees; Z turns the prism over unless it's `fixed`. Ves,
// when you're split up (Q) and she stands in a beam, puts her umbrella up
// and the beam bounces off it the way she's facing (Z turns her while you're
// steering her; she keeps holding it when you swap back to the hero). A crystal
// `eye: 'name'` lights its switch when a beam reaches it, for good (`latch:
// false` = only while the beam holds), and gates, lifts and the rest open
// with `opensWith: ['name']` like they do for levers. A room's `lightBridges`
// make a span over water or a drop walkable while their switch is on.
//
// What the beam does, tile by tile:
//   - it passes over floor, water, drops (sky), light bridges and open gates;
//   - it stops at walls and other solid tiles, rocks, closed gates, and any
//     solid prop (including sun-crystals), and at a block taller than it is;
//   - the hero or Ves in its way blocks it (Ves, split off from you, bounces it instead).
// All of it is read every frame, so a pushed rock or a turned prism changes
// the beams at once. See notes/docs/chapter-4-builders-guide.md for the full
// list of what room builders can write.

const STEP = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const TURN = {
  '/': { right: 'up', up: 'right', left: 'down', down: 'left' },
  '\\': { right: 'down', down: 'right', left: 'up', up: 'left' },
};
// Z turns Ves's umbrella a quarter, this way round.
const CLOCKWISE = { up: 'right', right: 'down', down: 'left', left: 'up' };
const VES = 'vesper';
const BEAM_TEXT = 'interactions/beams.txt';
// Tiles a beam flies over even though you can't walk on them: water, fen
// water, and the open sky of a drop. A tile's own `beamOver: true` (in
// TILES) or a room's `beamOver: '<letters>'` adds more.
const OVER = new Set(['~', '$', '_']);
// How high up a tile the beam runs (pixels above its bottom edge).
const BEAM_Y = 5;
// How fast Ves eases onto the middle of her tile when she's holding a beam
// (pixels a second).
const SETTLE_SPEED = 40;
const MAX_STEPS = 240;

const tileOf = (x, y) => `${Math.floor(x / T)},${Math.floor(y / T)}`;

// --- Prisms: which way they're set, remembered like levers are. ---

// A prism shows the look for the way it's set: prism ('/'), prism_back
// ('\\'), and prism_fixed / prism_fixed_back if it can't be turned.
export function prismLook(prop) {
  prop.setLook(`${prop.baseLook}${prop.fixed ? '_fixed' : ''}${prop.mirror === '\\' ? '_back' : ''}`);
}

// A room is built: prisms go back to how you left them (in the save).
export function restorePrisms(props) {
  for (const prop of props.filter((p) => p.mirror)) {
    const saved = WORLD_STATE.prisms?.[prop.key];
    if (saved && !prop.fixed) prop.mirror = saved;
    prismLook(prop);
  }
}

// The room's reset (the rock stump, a game over in the room): every prism
// back the way the room set it.
export function resetPrisms(props) {
  for (const prop of props.filter((p) => p.mirror)) {
    prop.mirror = prop.mirrorHome;
    if (WORLD_STATE.prisms) delete WORLD_STATE.prisms[prop.key];
    prismLook(prop);
  }
}

// Mistakes in a room's beam parts, caught when the room is built (so the
// room check reports them): a beam that goes nowhere, a prism that's neither
// '/' nor '\\', an eye with no switch, a light bridge over solid floor.
export function checkBeams(data) {
  for (const p of data.props ?? []) {
    const where = `${p.sprite} at ${p.x},${p.y}`;
    if (p.beam && !STEP[p.beam]) throw new Error(`${where}: beam must be 'up', 'down', 'left' or 'right', not '${p.beam}'`);
    if (p.mirror && !TURN[p.mirror]) throw new Error(`${where}: mirror must be '/' or '\\\\' (write the backslash twice in the source), not '${p.mirror}'`);
    if (p.eye !== undefined && typeof p.eye !== 'string') throw new Error(`${where}: eye must be the name of a switch`);
  }
  for (const span of data.lightBridges ?? []) {
    const where = `lightBridge at ${span.x},${span.y}`;
    if (![span.x, span.y, span.w, span.h].every(Number.isInteger)) throw new Error(`${where}: needs whole-number x, y, w and h`);
    for (let ty = span.y; ty < span.y + span.h; ty++) {
      for (let tx = span.x; tx < span.x + span.w; tx++) {
        const char = data.tiles[ty]?.[tx];
        if (char === undefined) throw new Error(`${where}: ${tx},${ty} is outside the room`);
        if (!TILES[char]?.solid) throw new Error(`${where}: ${tx},${ty} is '${char}', which you can walk on already (a light bridge goes over water or a drop)`);
      }
    }
  }
}

// Ves is well again (Chapter 4 on): off her crutch, umbrella back, walking,
// jumping and climbing like anyone, and not on your back. Safe to call any
// time. A room with `vesWell: true` does it as you arrive (the scene does
// the same with { do: 'hurt', who: 'vesper', on: false }).
export function makeVesWell() {
  if (isHurt(VES)) setHurt(VES, false);
  if (WORLD_STATE.carrying === VES) delete WORLD_STATE.carrying;
}

export function usesBeams(data) {
  return Boolean((data.lightBridges ?? []).length) || (data.props ?? []).some((p) => p.beam || p.mirror || p.eye);
}

export class BeamField {
  constructor(scene) {
    this.scene = scene;
    this.room = scene.room;
    this.data = scene.roomData;
    const props = this.room.allProps;
    this.crystals = props.filter((p) => p.beam);
    this.eyes = props.filter((p) => p.eye);
    this.spans = (this.data.lightBridges ?? []).map((span) => ({ ...span, on: false, alpha: 0 }));
    this.over = new Set([...OVER, ...(this.data.beamOver ?? '')]);
    this.bridgeSprite = this.spans.length ? makeSprite(PROP_SPRITES.light_bridge, PROP_PALETTE) : null;
    this.active = Boolean(this.crystals.length || this.eyes.length || this.spans.length);
    this.time = 0;
    // Each beam: { points, level, hits } from the last frame.
    this.beams = [];
    // The tiles any beam crosses ("x,y").
    this.tiles = new Set();
    // Ves holding a beam right now: { body, x, y } or null.
    this.braced = null;
    // Which eyes are lit this frame.
    this.lit = new Set();
    if (this.active) this.compute(false);
    for (const span of this.spans) span.alpha = span.on ? 1 : 0;
  }

  // --- Each frame ---

  update(dt, input) {
    if (!this.active) return;
    this.time += dt;
    this.settle(dt, input);
    this.compute(true);
    for (const span of this.spans) span.alpha += ((span.on ? 1 : 0) - span.alpha) * Math.min(1, dt * 6);
  }

  // Everyone who can stand in a beam: { body, tx, ty, level, ves }. Whoever's
  // just following along doesn't count: the light passes them by, so Ves
  // trailing after you never cuts a beam off by accident.
  bodies() {
    const s = this.scene;
    const list = [s.player, ...s.others].filter((b) => b && !b.hidden && !b.tucked);
    return [...new Set(list)].map((body) => ({
      body,
      tx: Math.floor(body.x / T),
      ty: Math.floor((body.y - 1) / T),
      level: body.ground ?? 0,
      // Ves with an umbrella to put up: whenever you're split up, whether
      // you're steering her or she's waiting while you steer the hero.
      ves: body.skin === VES,
    }));
  }

  // Props by the tiles they stand on, those a beam can meet.
  occupancy() {
    const map = new Map();
    for (const prop of this.room.props) {
      if (prop.hidden || prop.isOpen) continue;
      const at = prop.slide ? { x: prop.slide.toX, y: prop.slide.toY } : prop;
      const first = Math.floor(at.x / T);
      const last = Math.floor((at.x + prop.width - 1) / T);
      const ty = Math.floor(at.y / T);
      for (let tx = first; tx <= last; tx++) {
        const key = `${tx},${ty}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(prop);
      }
    }
    return map;
  }

  compute(announce) {
    const { room } = this;
    const bodies = this.bodies();
    const occupied = this.occupancy();
    this.beams = [];
    this.tiles = new Set();
    const lit = new Set();
    let braced = null;
    for (const crystal of this.crystals) {
      if (crystal.hidden || !(crystal.beamWhen ? room.isLeverOn(crystal.beamWhen) : true)) {
        crystal.beamOn = false;
        continue;
      }
      crystal.beamOn = true;
      const level = crystal.raise ?? 0;
      const beam = this.shoot(Math.floor(crystal.x / T), Math.floor(crystal.y / T), crystal.beam, level, bodies, occupied, lit);
      if (beam.ves) braced = beam.ves;
      this.beams.push(beam);
    }
    const wasBraced = this.braced;
    this.braced = braced;
    // Whatever the light has only just reached sings: a ping for a prism, a
    // dong for an eye (only for changes as you play, not on walking in).
    const touched = new Set(this.beams.flatMap((beam) => beam.touched));
    if (announce && this.touched) {
      const fresh = [...touched].filter((p) => !this.touched.has(p));
      if (fresh.some((p) => p.eye)) sfx('dong');
      else if (fresh.length) sfx('ping');
    }
    this.touched = touched;
    this.lit = lit;
    if (announce && braced && !wasBraced) this.firstBrace(braced.body);
    this.settleEyes(announce, bodies);
    this.settleSpans(bodies, announce);
  }

  // One beam from a tile, going `dir` at height `level`: the points it turns
  // at, and what it ended on. Lights eyes it reaches into `lit`.
  shoot(startX, startY, dir, level, bodies, occupied, lit) {
    const { room } = this;
    const point = (tx, ty, extra = 0) => ({ x: tx * T + T / 2 + extra, y: ty * T + BEAM_Y - level });
    let tx = startX;
    let ty = startY;
    const [sx, sy] = STEP[dir];
    const points = [{ ...point(tx, ty), x: tx * T + T / 2 + sx * 5, y: ty * T + BEAM_Y - level + sy * 3 }];
    const hits = [];
    const touched = [];
    this.tiles.add(`${tx},${ty}`);
    const seen = new Set();
    let ves = null;
    for (let steps = 0; steps < MAX_STEPS; steps++) {
      const [dx, dy] = STEP[dir];
      tx += dx;
      ty += dy;
      const key = `${tx},${ty},${dir}`;
      if (seen.has(key)) break;
      seen.add(key);
      const tile = room.tileAt(tx, ty);
      const centre = point(tx, ty);
      const edge = { x: centre.x - dx * (T / 2), y: centre.y - dy * (T / 2) };
      if (tile === null) {
        points.push(edge);
        break;
      }
      // Ground that's too tall, or a wall: the beam ends at its face.
      const raise = room.raiseAt(tx, ty);
      const flies = !room.isSolidTile(tx, ty) || this.over.has(tile) || TILES[tile]?.beamOver;
      if (raise > level || !flies) {
        points.push(edge);
        hits.push({ ...edge, kind: 'wall' });
        break;
      }
      // Things on this tile, if they're at the beam's height.
      const here = raise === level ? (occupied.get(`${tx},${ty}`) ?? []) : [];
      const crossed = `${tx},${ty}`;
      const prism = here.find((p) => p.mirror);
      if (prism) {
        this.tiles.add(crossed);
        points.push(centre);
        hits.push({ ...centre, kind: 'turn' });
        touched.push(prism);
        dir = TURN[prism.mirror][dir];
        continue;
      }
      const eye = here.find((p) => p.eye);
      if (eye) {
        this.tiles.add(crossed);
        points.push(centre);
        hits.push({ ...centre, kind: 'eye' });
        touched.push(eye);
        lit.add(eye);
        break;
      }
      // Someone standing in it.
      const who = bodies.find((b) => b.tx === tx && b.ty === ty && b.level === level && !b.body.isAirborne);
      if (who) {
        this.tiles.add(crossed);
        points.push(centre);
        if (who.ves) {
          // Her umbrella: the beam goes the way she's facing.
          ves = { body: who.body, x: centre.x, y: centre.y, tx, ty };
          hits.push({ ...centre, kind: 'ves' });
          dir = who.body.facing in STEP ? who.body.facing : dir;
          continue;
        }
        hits.push({ ...centre, kind: 'body' });
        break;
      }
      // A rock, a closed gate, a crystal, a statue: anything solid.
      if (here.some((p) => !p.walkable && !p.gap && !p.flow)) {
        points.push(edge);
        hits.push({ ...edge, kind: 'wall' });
        break;
      }
      this.tiles.add(crossed);
    }
    return { points, level, hits, ves, touched };
  }

  // Eyes in the light switch their names on; the ones that latch stay on.
  settleEyes(announce, bodies) {
    const { room } = this;
    const levers = () => WORLD_STATE.levers ?? [];
    let changed = false;
    let lightedOne = false;
    const holding = new Set();
    for (const eye of this.eyes) {
      if (eye.hidden || !this.lit.has(eye)) continue;
      if (eye.latch === false) {
        holding.add(eye.eye);
      } else if (!levers().includes(room.leverKey(eye.eye))) {
        WORLD_STATE.levers ??= [];
        WORLD_STATE.levers.push(room.leverKey(eye.eye));
        changed = true;
        lightedOne = true;
      }
    }
    const before = room.beamSwitches ?? new Set();
    if (holding.size !== before.size || [...holding].some((name) => !before.has(name))) {
      if ([...holding].some((name) => !before.has(name))) lightedOne = true;
      room.beamSwitches = holding;
      changed = true;
    }
    for (const eye of this.eyes) {
      const on = this.lit.has(eye) || (eye.latch !== false && levers().includes(room.leverKey(eye.eye)));
      eye.setLook(on ? `${eye.baseLook}_lit` : null);
      eye.shining = on;
    }
    if (!changed) return;
    const opened = room.refreshPuzzles(bodies.map((b) => b.body));
    if (!announce) return;
    if (lightedOne) sfx('flare');
    if (opened.length) {
      sfx('door');
      const gate = opened[0];
      if (gate.openText) this.scene.textbox.open(textSection(this.data.textFile, gate.openText));
    }
  }

  // Light bridges: a span's tiles are walkable while its switch is on (and
  // stay so while anyone is standing on it).
  settleSpans(bodies, announce) {
    const walk = new Set();
    let formed = false;
    for (const span of this.spans) {
      const names = [].concat(span.when ?? []);
      let on = names.every((name) => this.room.isLeverOn(name));
      if (!on && span.on) {
        on = bodies.some(({ tx, ty }) => tx >= span.x && tx < span.x + span.w && ty >= span.y && ty < span.y + span.h);
      }
      if (on && !span.on) formed = true;
      span.on = on;
      if (on) {
        for (let ty = span.y; ty < span.y + span.h; ty++) for (let tx = span.x; tx < span.x + span.w; tx++) walk.add(`${tx},${ty}`);
      }
    }
    this.room.spans = walk;
    if (announce && formed && this.spansSettled) sfx('shimmer');
    this.spansSettled = true;
  }

  // Ves holds still on the middle of her tile while the beam's on her, so it
  // lands cleanly on her umbrella (unless you're walking her somewhere).
  settle(dt, input) {
    const b = this.braced?.body;
    if (!b || b !== this.scene.player || b.isAirborne) return;
    if (['left', 'right', 'up', 'down'].some((k) => input.isDown(k))) return;
    const cx = this.braced.tx * T + T / 2;
    const cy = (this.braced.ty + 1) * T - 3;
    const step = SETTLE_SPEED * dt;
    if (b.x !== cx) b.moveAxis(this.room, 'x', Math.sign(cx - b.x) * Math.min(step, Math.abs(cx - b.x)));
    if (b.y !== cy) b.moveAxis(this.room, 'y', Math.sign(cy - b.y) * Math.min(step, Math.abs(cy - b.y)));
  }

  // The first beam to land on her umbrella: she says how it works.
  firstBrace(body) {
    if (body !== this.scene.player) return;
    WORLD_STATE.read ??= [];
    if (WORLD_STATE.read.includes('beam_umbrella_first')) return;
    WORLD_STATE.read.push('beam_umbrella_first');
    this.scene.textbox.open(textSection(BEAM_TEXT, 'umbrella_first'), VES);
  }

  // --- What Z does ---

  // Z while Ves holds a beam: she turns a quarter, and the beam with her.
  turnUmbrella() {
    const b = this.braced?.body;
    if (!b || b !== this.scene.player) return false;
    b.facing = CLOCKWISE[b.facing];
    b.moving = false;
    sfx('click');
    this.compute(true);
    return true;
  }

  // Z on a prism turns it over (not if it's fixed).
  interact(prop) {
    if (!prop.mirror || prop.fixed) return false;
    prop.mirror = prop.mirror === '/' ? '\\' : '/';
    WORLD_STATE.prisms ??= {};
    WORLD_STATE.prisms[prop.key] = prop.mirror;
    prismLook(prop);
    sfx('click');
    this.compute(true);
    return true;
  }

  // --- For tests (tools/preview.html) ---

  hasBeamAt(tx, ty) {
    return this.tiles.has(`${tx},${ty}`);
  }

  describe() {
    const prisms = this.room.props.filter((p) => p.mirror).map((p) => `${p.x / T},${p.y / T}${p.mirror}`);
    const lit = this.eyes.filter((e) => e.shining).map((e) => e.eye);
    return `beams ${this.beams.length} (${this.tiles.size} tiles)${this.braced ? ' VES-UMBRELLA' : ''} | prisms ${prisms.join(' ')} | lit ${lit.join(',')}`;
  }

  // --- Light in dark rooms ---

  // Soft holes for the dark to show through, along every beam and round what
  // glows: { x, y, radius, cut } in world pixels.
  lights() {
    if (!this.active) return [];
    const out = [];
    for (const beam of this.beams) {
      for (let i = 1; i < beam.points.length; i++) {
        const a = beam.points[i - 1];
        const b = beam.points[i];
        const length = Math.hypot(b.x - a.x, b.y - a.y);
        const count = Math.max(1, Math.ceil(length / 9));
        for (let n = 0; n <= count; n++) out.push({ x: a.x + ((b.x - a.x) * n) / count, y: a.y + ((b.y - a.y) * n) / count + 2, radius: 17, cut: 0.9 });
      }
      for (const hit of beam.hits) out.push({ x: hit.x, y: hit.y, radius: hit.kind === 'wall' ? 18 : 30, cut: 1 });
    }
    for (const crystal of this.crystals) {
      if (crystal.beamOn) out.push({ x: crystal.x + T / 2, y: crystal.y + T / 2 - (crystal.raise ?? 0), radius: 44, cut: 1 });
    }
    for (const eye of this.eyes) {
      if (eye.shining) out.push({ x: eye.x + T / 2, y: eye.y + T / 2 - (eye.raise ?? 0), radius: 42, cut: 1 });
    }
    for (const span of this.spans) {
      if (span.alpha < 0.05) continue;
      for (let ty = span.y; ty < span.y + span.h; ty++) {
        for (let tx = span.x; tx < span.x + span.w; tx++) out.push({ x: tx * T + T / 2, y: ty * T + T / 2, radius: 24, cut: span.alpha });
      }
    }
    return out;
  }

  // Whether a beam (or a glowing thing) lights this prop, for props that can
  // only be seen in the light of a dark room.
  litProp(prop) {
    return this.tiles.has(tileOf(prop.x, prop.y)) || (prop.eye && prop.shining) || (prop.beam && prop.beamOn);
  }

  // --- Drawing ---

  // The light bridges, on the floor (under everyone).
  drawFloor(ctx, camera) {
    const sprite = this.bridgeSprite;
    for (const span of this.spans) {
      if (span.alpha < 0.02) continue;
      for (let ty = span.y; ty < span.y + span.h; ty++) {
        for (let tx = span.x; tx < span.x + span.w; tx++) {
          const x = tx * T - camera.x;
          const y = ty * T - camera.y;
          const shimmer = 0.78 + 0.16 * Math.sin(this.time * 3 + tx * 1.3 + ty);
          ctx.globalAlpha = span.alpha * shimmer;
          if (sprite) ctx.drawImage(sprite, x, y);
          ctx.globalAlpha = 1;
        }
      }
      // A soft glow over the whole span, and a few motes drifting up.
      const sx = span.x * T - camera.x;
      const sy = span.y * T - camera.y;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(150, 255, 225, ${(0.1 * span.alpha).toFixed(3)})`;
      ctx.fillRect(sx - 2, sy - 2, span.w * T + 4, span.h * T + 4);
      ctx.fillStyle = `rgba(255, 250, 220, ${(0.8 * span.alpha).toFixed(3)})`;
      for (let i = 0; i < span.w * span.h * 2; i++) {
        const seed = i * 37.7;
        const mx = (seed * 3.1) % (span.w * T);
        const rise = (this.time * 9 + seed * 1.7) % (span.h * T);
        ctx.fillRect(Math.round(sx + mx), Math.round(sy + span.h * T - rise), 1, 1);
      }
      ctx.restore();
    }
  }

  // The beams, the glow round what's lit, Ves's umbrella: over everything.
  draw(ctx, camera) {
    if (!this.active) return;
    const t = this.time;
    ctx.save();
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    for (const beam of this.beams) this.drawBeam(ctx, camera, beam, t);
    // Sun-crystals shine while they're throwing a beam; lit eyes glow teal.
    ctx.globalCompositeOperation = 'lighter';
    for (const crystal of this.crystals) {
      if (!crystal.beamOn) continue;
      this.glow(ctx, crystal.x + T / 2 - camera.x, crystal.y + T / 2 - (crystal.raise ?? 0) - camera.y - 2, 15, '255, 214, 120', 0.42 + 0.1 * Math.sin(t * 4 + crystal.x));
    }
    for (const eye of this.eyes) {
      if (!eye.shining) continue;
      this.glow(ctx, eye.x + T / 2 - camera.x, eye.y + T / 2 - (eye.raise ?? 0) - camera.y - 2, 14, '120, 255, 225', 0.5 + 0.12 * Math.sin(t * 5 + eye.x));
    }
    ctx.restore();
    // Sparkles where a beam turns or lands.
    for (const beam of this.beams) {
      for (const hit of beam.hits) this.drawSpark(ctx, camera, hit, t);
    }
    if (this.braced) this.drawUmbrella(ctx, camera, this.braced, t);
  }

  glow(ctx, x, y, radius, color, alpha) {
    const g = ctx.createRadialGradient(x, y, 1, x, y, radius);
    g.addColorStop(0, `rgba(${color}, ${alpha.toFixed(3)})`);
    g.addColorStop(1, `rgba(${color}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  // A bright core, a gold glow round it, a teal haze round that, motes
  // running along it, and a flicker.
  drawBeam(ctx, camera, beam, t) {
    const pts = beam.points.map((p) => ({ x: Math.round(p.x - camera.x) + 0.5, y: Math.round(p.y - camera.y) + 0.5 }));
    if (pts.length < 2) return;
    const flicker = 0.88 + 0.12 * Math.sin(t * 11) * Math.sin(t * 3.1);
    const path = () => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
    };
    ctx.globalCompositeOperation = 'lighter';
    for (const [width, color, alpha] of [[7, '90, 230, 205', 0.1], [5, '255, 214, 120', 0.2], [3, '255, 232, 160', 0.38]]) {
      ctx.strokeStyle = `rgba(${color}, ${(alpha * flicker).toFixed(3)})`;
      ctx.lineWidth = width;
      path();
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = `rgba(255, 252, 232, ${(0.95 * flicker).toFixed(3)})`;
    ctx.lineWidth = 1;
    path();
    ctx.stroke();
    // Motes running along it, and a shimmer either side.
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      if (!length) continue;
      const ux = (b.x - a.x) / length;
      const uy = (b.y - a.y) / length;
      for (let d = (t * 38 + i * 7) % 17; d < length; d += 17) {
        const wave = Math.round(Math.sin(d * 0.9 + t * 6) * 1.5);
        const x = Math.round(a.x + ux * d - uy * wave);
        const y = Math.round(a.y + uy * d + ux * wave);
        ctx.fillStyle = 'rgba(255, 255, 240, 0.95)';
        ctx.fillRect(x, y, Math.abs(ux) > 0.5 ? 3 : 1, Math.abs(uy) > 0.5 ? 3 : 1);
      }
      for (let d = (t * 21 + i * 11) % 23; d < length; d += 23) {
        const side = Math.sin(d + t * 4) > 0 ? 2 : -2;
        ctx.fillStyle = 'rgba(160, 255, 230, 0.7)';
        ctx.fillRect(Math.round(a.x + ux * d - uy * side), Math.round(a.y + uy * d + ux * side), 1, 1);
      }
    }
  }

  // A twinkle where the beam bends or lands: a star at a prism or Ves's
  // umbrella, a flare at the eye, a spatter of sparks on a wall.
  drawSpark(ctx, camera, hit, t) {
    const x = Math.round(hit.x - camera.x);
    const y = Math.round(hit.y - camera.y);
    const pulse = 0.6 + 0.4 * Math.sin(t * 9 + hit.x * 0.7);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (hit.kind === 'wall' || hit.kind === 'body') {
      this.glow(ctx, x, y, 7, '255, 220, 140', 0.5 * pulse);
      ctx.fillStyle = 'rgba(255, 250, 225, 0.9)';
      for (let i = 0; i < 3; i++) {
        const a = t * 7 + i * 2.1 + hit.x;
        const r = 2 + ((t * 9 + i * 3) % 4);
        ctx.fillRect(Math.round(x + Math.cos(a) * r), Math.round(y + Math.sin(a) * r), 1, 1);
      }
      ctx.restore();
      return;
    }
    const big = hit.kind === 'ves' ? 1.4 : 1;
    this.glow(ctx, x, y, 11 * big, '255, 236, 170', 0.55 * pulse);
    const r = Math.round((3 + 2 * pulse) * big);
    ctx.fillStyle = 'rgba(255, 255, 245, 0.95)';
    ctx.fillRect(x - r, y, r * 2 + 1, 1);
    ctx.fillRect(x, y - r, 1, r * 2 + 1);
    ctx.fillStyle = 'rgba(190, 255, 238, 0.85)';
    const d = Math.max(1, Math.round(r * 0.6));
    ctx.fillRect(x - d, y - d, 1, 1);
    ctx.fillRect(x + d, y - d, 1, 1);
    ctx.fillRect(x - d, y + d, 1, 1);
    ctx.fillRect(x + d, y + d, 1, 1);
    ctx.restore();
  }

  // Ves's umbrella, up and glowing, held out the way she's facing.
  drawUmbrella(ctx, camera, braced, t) {
    const { body, x, y } = braced;
    const angle = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[body.facing] ?? 0;
    const pulse = 0.65 + 0.35 * Math.sin(t * 8);
    ctx.save();
    ctx.translate(Math.round(x - camera.x), Math.round(y - camera.y));
    ctx.rotate(angle);
    // The glow behind it.
    ctx.globalCompositeOperation = 'lighter';
    this.glow(ctx, 9, 0, 17, '255, 220, 140', 0.24 * pulse);
    ctx.globalCompositeOperation = 'source-over';
    // Her arm and the shaft.
    ctx.strokeStyle = '#7a4f2a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-4, 0.5);
    ctx.lineTo(4, 0.5);
    ctx.stroke();
    // The canopy, curving away from her: plum, with its ribs.
    ctx.beginPath();
    ctx.ellipse(4, 0.5, 6, 11, 0, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fillStyle = '#8f4672';
    ctx.fill();
    ctx.strokeStyle = '#5a2846';
    ctx.lineWidth = 1;
    for (const a of [-1.1, -0.55, 0, 0.55, 1.1]) {
      ctx.beginPath();
      ctx.moveTo(4, 0.5);
      ctx.lineTo(4 + Math.cos(a) * 6, 0.5 + Math.sin(a) * 11);
      ctx.stroke();
    }
    ctx.strokeStyle = '#120c1c';
    ctx.beginPath();
    ctx.ellipse(4, 0.5, 6, 11, 0, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.stroke();
    // Its rim, bright where the beam lands on it.
    ctx.shadowColor = 'rgba(255, 226, 140, 1)';
    ctx.shadowBlur = 5;
    ctx.strokeStyle = `rgba(255, 244, 200, ${(0.7 + 0.3 * pulse).toFixed(3)})`;
    ctx.beginPath();
    ctx.ellipse(4, 0.5, 6, 11, 0, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.restore();
  }
}
