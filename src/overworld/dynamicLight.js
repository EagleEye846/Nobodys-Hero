import { TILE_SIZE as T, SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { TILES } from './tileset.js';
import { daylight, timeOfDay } from './daylight.js';
import { cachedRoomLights, ambientFor, flickerAt, breatheAt, skyColor, PROP_GLOWS } from './lamplight.js';
import { silhouette, drawShadows, drawBlockShadows } from './shadows.js';
import { COAST_AREAS } from './coastTiles.js';
import { WORLD_STATE } from '../state/saveGame.js';
import { flashScale } from '../state/settings.js';

// For stills (tools/preview.html &flash=): hold a lightning flash this bright.
let heldFlash = null;
export function holdFlash(k) { heldFlash = k; }

// DYNAMIC LIGHT: the room's lamps, fires and windows lighting the people in
// it, not only the ground. It works on top of lamplight.js (the shade and the
// pools), the dark rooms' candle (overworldScene.drawDarkness) and the night
// outdoors, in every chapter, and only when it's dark enough to matter (a
// lamplit room's shade, a dark room, or night under the sky). By day nothing
// here draws at all.
//
// - People lit by the lamps: the hero, Ves, Bramble, folk and monsters near a
//   lamp or fire take on its colour and get a one-pixel rim of it on the side
//   facing it, in whole steps (eight of them), so it reads as pixel art, not
//   a blur. Away from the lights they're left to the room's shade. They
//   draw themselves as always, but each picture they draw is swapped for a
//   lit copy of it, made once and kept (so every bob, squash and gust is lit
//   exactly, for no more than the cost of drawing them). At most a dozen are
//   lit at once: the brightest, the party first.
// - Lamp shadows: each of them throws a flat shadow along the ground away
//   from the strongest light near them, longer the further they are from it,
//   in two bands (dark near the feet, fainter further out).
// - Lightning: a flash (atmosphere.js) lifts the room's shade for a moment and
//   throws long shadows from everything standing (posts, masts, people,
//   cabins), all leaning the same way, a different way each flash. It goes
//   with the LIGHTNING FLASHES option: SOFT is a third as strong, OFF none.
// - Windows: outdoors, a lit window lays a stepped spill of its light on the
//   ground in front of it; indoors, the daylight from a window falls across
//   the floor in a banded shaft that leans with the sun (grey-green in the
//   storm, warm by day, gold at dusk, a faint blue under the moon).
// - Flames breathe (lamplight.js breatheAt): their pools swell and shrink a
//   little, a fire quickly, a lantern slowly. Strolling folk with a lamp
//   (Belowtown's lamplighters), glowing cutscene actors and, in a dark room,
//   your own light carry theirs with them.
//
// A room can say `dynamicLight: false` to leave all of it out, or
// `windowShafts: false` for no shafts indoors.
//
// Cost: the room's lights are the cached list from lamplight.js (made once,
// moved only when a prop moves); window spills and shafts are found once a
// room and drawn from small pictures made once per colour; per frame it's a
// loop over the lights on screen for each person on screen, and a handful of
// small canvas copies for each one who's lit.

const STEPS = 8;
// At most this many people are lit at once (the brightest; the party first).
const MAX_LIT = 12;
const band = (v) => Math.round(Math.min(1, v) * STEPS) / STEPS;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// 'r, g, b' strings as numbers, kept.
const rgbCache = new Map();
function rgbOf(color) {
  let rgb = rgbCache.get(color);
  if (!rgb) {
    rgb = color.split(',').map(Number);
    rgbCache.set(color, rgb);
  }
  return rgb;
}
const WARM = '255, 176, 96';
const CRYSTAL_BLUE = '150, 215, 255';
const SHAFT_DAY = '255, 240, 204';
const SHAFT_DUSK = '255, 186, 112';
const SHAFT_MOON = '150, 178, 255';
const SHAFT_STORM = '176, 214, 196';

// The spill of a lit window on the ground: a stepped fan, narrow at the wall
// and wider out, three bands of light with dithered sides. One per colour.
const spills = new Map();
function spillSprite(color) {
  let canvas = spills.get(color);
  if (canvas) return canvas;
  canvas = Object.assign(document.createElement('canvas'), { width: 24, height: 16 });
  const c = canvas.getContext('2d');
  for (let y = 0; y < 16; y++) {
    const half = Math.round(5 + y * 0.45);
    const alpha = y < 5 ? 0.9 : y < 10 ? 0.55 : 0.28;
    c.fillStyle = `rgba(${color}, ${alpha})`;
    c.fillRect(12 - half + 1, y, half * 2 - 2, 1);
    // The sides every other pixel: dithered, not blurred.
    c.fillStyle = `rgba(${color}, ${alpha * 0.5})`;
    if ((y & 1) === 0) { c.fillRect(12 - half, y, 1, 1); c.fillRect(12 + half - 1, y, 1, 1); }
  }
  spills.set(color, canvas);
  return canvas;
}

// A shaft of daylight from a window: a parallelogram `length` long leaning
// `lean` pixels sideways for each pixel down, four bands fading away from
// the window, its edges dithered, and a brighter patch where it lands.
const shafts = new Map();
function shaftSprite(color, width, length, lean) {
  const key = `${color}|${width}|${length}|${lean}`;
  let canvas = shafts.get(key);
  if (canvas) return canvas;
  const reach = Math.ceil(Math.abs(lean) * length);
  canvas = Object.assign(document.createElement('canvas'), { width: width + reach + 2, height: length + 1 });
  const c = canvas.getContext('2d');
  const left0 = lean < 0 ? reach + 1 : 1;
  for (let y = 0; y <= length; y++) {
    const along = y / length;
    const alpha = along < 0.25 ? 0.5 : along < 0.5 ? 0.38 : along < 0.75 ? 0.27 : 0.18;
    const x = Math.round(left0 + lean * y);
    c.fillStyle = `rgba(${color}, ${alpha})`;
    c.fillRect(x + 1, y, width - 2, 1);
    c.fillStyle = `rgba(${color}, ${alpha * 0.5})`;
    if ((y & 1) === 0) { c.fillRect(x, y, 1, 1); c.fillRect(x + width - 1, y, 1, 1); }
  }
  // Where it lands on the floor.
  const x = Math.round(left0 + lean * length);
  c.fillStyle = `rgba(${color}, 0.22)`;
  c.fillRect(x - 1, length - 3, width + 2, 3);
  shafts.set(key, canvas);
  return canvas;
}

// --- Lit copies of pictures ---
//
// A person's pictures redrawn as lit by a light: every pixel brightened and
// warmed by the light's colour (a colour dodge: c / (1 - gain * light), so
// the light parts glow and the dark outlines stay dark), and the pixels on
// the edge facing the light (`ox`, `oy`) taken most of the way to the light's
// colour, for a one-pixel rim (not on the bottom three rows: the feet).
// Each copy is made once and kept with its picture.
let litCopies = new WeakMap();
let litCount = 0;
function litCopy(image, key, color, amount, ox, oy) {
  let copies = litCopies.get(image);
  if (!copies) litCopies.set(image, (copies = new Map()));
  let copy = copies.get(key);
  if (copy) return copy;
  const w = image.width;
  const h = image.height;
  if (!w || !h) return image;
  copy = document.createElement('canvas');
  copy.width = w;
  copy.height = h;
  const c = copy.getContext('2d', { willReadFrequently: true });
  c.drawImage(image, 0, 0);
  const pixels = c.getImageData(0, 0, w, h);
  const px = pixels.data;
  const alpha = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : px[(y * w + x) * 4 + 3]);
  const [lr, lg, lb] = rgbOf(color);
  const gain = Math.min(0.28, amount * 0.4);
  const mul = [lr, lg, lb].map((v) => 1 / (1 - gain * (v / 255)));
  const rim = rgbOf(color).map((v) => (v + 255) / 2);
  const rimK = Math.min(0.85, amount * 1.1);
  // Which pixels are on the lit edge, before any are changed.
  // (Rim turned off: it read as a coloured outline round people.)
  const edge = new Uint8Array(w * h);
  if (false && (ox || oy)) {
    for (let y = 0; y < h - 3; y++) {
      for (let x = 0; x < w; x++) {
        if (alpha(x, y) > 200 && alpha(x + ox, y + oy) < 60) edge[y * w + x] = 1;
      }
    }
  }
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    if (!px[o + 3]) continue;
    for (let k = 0; k < 3; k++) {
      let v = Math.min(255, px[o + k] * mul[k]);
      if (edge[i]) v += (rim[k] - v) * rimK;
      px[o + k] = Math.round(v);
    }
  }
  c.putImageData(pixels, 0, 0);
  copies.set(key, copy);
  // (Kept from growing without end: start again past a few thousand.)
  if (++litCount > 4000) { litCount = 0; litCopies = new WeakMap(); }
  return copy;
}

// The drawing context a lit person draws onto: the room's own, except that
// any picture drawn is its lit copy. One, shared; set up for each person.
const litDraw = { ctx: null, key: '', color: '', amount: 0, ox: 0, oy: 0, proxy: null };
const bound = new Map();
litDraw.proxy = new Proxy({}, {
  get(_, prop) {
    const ctx = litDraw.ctx;
    if (prop === 'drawImage') {
      return (image, ...rest) => {
        const lit = image && image.width ? litCopy(image, litDraw.key, litDraw.color, litDraw.amount, litDraw.ox, litDraw.oy) : image;
        ctx.drawImage(lit, ...rest);
      };
    }
    const value = ctx[prop];
    if (typeof value !== 'function') return value;
    let fn = bound.get(prop);
    if (!fn) bound.set(prop, (fn = function (...args) { return litDraw.ctx[prop](...args); }));
    return fn;
  },
  set(_, prop, value) {
    litDraw.ctx[prop] = value;
    return true;
  },
});

// Window tiles that can be lit: a cabin window anywhere, and a coast house's.
const WINDOW_TILES = new Set(['w']);
const COAST_WINDOW = '6';

class DynamicLight {
  constructor(scene) {
    this.scene = scene;
    this.room = scene.room;
    this.on = false;
    this.lights = [];
    this.pool = [];
    this.near = [];
    this.flash = 0;
    this.dimK = 0;
    this.spills = null;
    this.spillsFor = -1;
    this.shaftList = null;
    this.hit = { sum: 0, best: null, value: 0 };
    // Who's lit this frame (chosen in drawGround), and how.
    this.lit = new Map();
    this.picks = [];
  }

  // A light for this frame, from the reused pool.
  add(x, y, r, k, color, own = null) {
    const l = this.pool[this.lights.length] ??= {};
    l.x = x; l.y = y; l.r = r; l.k = k; l.color = color; l.own = own;
    this.lights.push(l);
    return l;
  }

  // Once a frame, before anything is drawn: how dark the room is, and the
  // lights in it right now.
  begin() {
    const s = this.scene;
    this.on = false;
    this.lights.length = 0;
    this.near.length = 0;
    this.flash = 0;
    const data = s.roomData;
    // Out in the open (the storm areas count, though their time of day doesn't show).
    this.outside = !data.indoors && !data.dark;
    if (s.spire || data.dynamicLight === false) return;
    const t = s.time;
    const { night } = daylight();
    this.night = night;
    // (Last frame's flash: the weather draws after the people. Already scaled
    // by the LIGHTNING FLASHES option, so OFF is nothing here too.)
    this.flash = heldFlash !== null ? heldFlash * flashScale() : s.atmosphere?.flashK ?? 0;
    let dim = 0;
    if (data.dark) {
      dim = data.dark;
      const swell = s.swell ?? 0;
      for (const l of s.room.lightSources()) this.add(l.x, l.y + 6, l.radius * (l.crystal && swell ? 0.85 + 0.55 * swell : 1), 0.85, l.crystal ? CRYSTAL_BLUE : WARM);
      // Your own light, carried with you: it lights Ves and Bramble and
      // throws their shadows away from you (not your own).
      const reach = s.lightReach();
      if (reach > 0) this.add(s.player.x, s.player.y - 2, reach * 1.1, 0.8, WARM, s.player);
      for (const l of s.cutscene?.lights ?? []) this.add(l.x, l.y + 8, l.radius, 0.8, WARM);
    } else if (s.lamplit) {
      const outdoors = Boolean(s.underSky);
      const { shade, lit } = ambientFor(data, outdoors, night);
      dim = shade;
      const list = cachedRoomLights(s.room, outdoors);
      const sky = skyColor(night);
      this.list = list;
      for (const l of list) {
        if (!l.pool) continue;
        const k = l.strength * flickerAt(l, t) * (l.sky ? 0.5 + night : lit);
        if (k < 0.04) continue;
        this.add(l.x, l.y, l.pool * breatheAt(l, t), k, l.sky ? sky : l.color);
      }
    } else if (s.underSky && night > 0.05) {
      dim = night * 0.44;
      for (const l of s.room.lightSources()) this.add(l.x, l.y + 6, l.radius, 0.75, l.crystal ? CRYSTAL_BLUE : WARM);
    }
    this.dim = dim;
    this.dimK = clamp01((dim - 0.06) / 0.34);
    // Only the lights that reach the view.
    const cam = s.camera;
    for (const l of this.lights) {
      const x = l.x - cam.x;
      const y = l.y - cam.y;
      if (x + l.r < -40 || x - l.r > W + 40 || y + l.r < -40 || y - l.r > H + 100) continue;
      this.near.push(l);
    }
    this.on = (this.dimK > 0.05 && this.near.length > 0) || this.flash > 0.02;
  }

  // The light at a point: all of it together (`sum`), and the strongest
  // light there and how strong it is.
  lightAt(x, y, self) {
    const hit = this.hit;
    hit.sum = 0;
    hit.best = null;
    hit.value = 0;
    for (const l of this.near) {
      if (l.own === self) continue;
      // (Not the light someone carries themselves: a lamplighter's own lamp.)
      if (Math.abs(x - l.x) < 7 && Math.abs(y - l.y) < 14 && self?.glow) continue;
      const dx = x - l.x;
      const dy = y - l.y;
      const d2 = dx * dx + dy * dy;
      if (d2 >= l.r * l.r) continue;
      const v = l.k * (1 - Math.sqrt(d2) / l.r);
      hit.sum += v;
      if (v > hit.value) { hit.value = v; hit.best = l; }
    }
    return hit;
  }

  // Whether a thing is somebody (the party, folk, monsters, a scene's cast).
  isBody(e) {
    const s = this.scene;
    if (e === s.player) return true;
    if (e.npc || e.shop || e.walk) return true;
    if (e.flat) return false;
    const actors = s.cutscene?.actors;
    return s.followers.includes(e) || s.others.includes(e) || s.npcs.includes(e) || (actors instanceof Map && e.id !== undefined && actors.get(e.id) === e);
  }

  // Shadows on the ground: the lamps' (away from the strongest light near
  // each person) and the lightning's. Call it after the floor and the sun's
  // shadows, before what stands on it.
  drawGround(ctx, entities) {
    // The windows' light on the floor first, under everyone.
    this.drawWindows(ctx);
    if (!this.on) return;
    const s = this.scene;
    const cam = s.camera;
    const lit = this.lit;
    lit.clear();
    if (this.dimK > 0.05) {
      const picks = this.picks;
      picks.length = 0;
      for (const e of entities) {
        if (!this.isBody(e)) continue;
        const cast = e.shadow?.();
        if (!cast?.image) continue;
        const sx = cast.x - cam.x;
        const sy = cast.y - cam.y;
        if (sx < -40 || sx > W + 40 || sy < -30 || sy > H + 90) continue;
        // Who's lit: the brightest few on screen (the party first among equals).
        const chest = this.lightAt(cast.x, cast.y - 8, e);
        const amount = band(chest.sum * this.dimK);
        if (chest.best && amount >= 1 / STEPS) picks.push({ e, cast, amount, light: chest.best, rank: amount + (e === s.player || s.followers.includes(e) ? 1 : 0) });
        // (Big sprites, someone in their armchair, say, keep only their foot shadow.)
        if (cast.image.height > 30) continue;
        const hit = this.lightAt(cast.x, cast.y, e);
        const l = hit.best;
        const strength = hit.value * this.dimK;
        if (!l || strength < 0.06) continue;
        const dx = cast.x - l.x;
        const dy = cast.y - l.y;
        const d = Math.hypot(dx, dy);
        if (d < 3) continue;
        const alpha = Math.round(Math.min(0.36, strength * 1.1) * 20) / 20;
        if (alpha < 0.05) continue;
        const length = 0.35 + 0.4 * Math.min(1, d / l.r);
        this.cast(ctx, cast, dx / d, dy / d, length, alpha);
      }
      if (picks.length > MAX_LIT) picks.sort((a, b) => b.rank - a.rank).length = MAX_LIT;
      for (const pick of picks) lit.set(pick.e, pick);
    }
    // Lightning: everything standing throws a long shadow the same way.
    if (this.flash > 0.03 && this.outside) {
      const n = s.atmosphere?.flashN ?? 0;
      const sun = { alpha: Math.min(0.5, 0.5 * this.flash), length: 1.1 + hash(n * 1.7) * 0.5, lean: (hash(n * 3.1) - 0.5) * 1.8 };
      drawBlockShadows(ctx, cam, s.room, sun);
      this.tall ??= [];
      this.tall.length = 0;
      for (const e of entities) {
        if (this.isBody(e)) { this.tall.push(e); continue; }
        const cast = e.shadow?.();
        if (cast?.image && cast.image.height >= 22) this.tall.push(e);
      }
      drawShadows(ctx, cam, this.tall, sun);
    }
  }

  // One person's shadow, laid flat along the ground in the direction (ux, uy),
  // `length` of their height: a full one faintly, and a shorter one over it,
  // so it's darker at the feet. The ground is seen at a slant, so up and down
  // the screen it's squashed.
  cast(ctx, cast, ux, uy, length, alpha) {
    const { image } = cast;
    const cam = this.scene.camera;
    const shape = silhouette(image);
    const wx = uy >= 0 ? uy : -uy;
    const wy = uy >= 0 ? -ux : ux;
    ctx.save();
    ctx.translate(Math.round(cast.x - cam.x), Math.round(cast.y - cam.y));
    for (const [k, a] of [[length, alpha * 0.6], [length * 0.5, alpha * 0.6]]) {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.transform(Math.max(0.35, wx), wy * 0.6, -ux * k, -uy * k * 0.6, 0, 0);
      ctx.drawImage(shape, -Math.floor(image.width / 2), -image.height);
      ctx.restore();
    }
    ctx.restore();
  }

  // Draws somebody lit by the lights near them, or returns false to leave
  // them to their own draw (no light on them, or not somebody).
  drawLit(ctx, e) {
    if (!this.on) return false;
    const pick = this.lit.get(e);
    if (!pick) return false;
    const { cast, amount, light: l } = pick;
    // Which side the light is on: the rim goes on that edge.
    const dx = l.x - cast.x;
    const dy = l.y - (cast.y - 8);
    const d = Math.hypot(dx, dy) || 1;
    let ox = amount >= 0.25 ? (dx / d > 0.35 ? 1 : dx / d < -0.35 ? -1 : 0) : 0;
    // (Folk walking left are drawn mirrored: so is their rim.)
    if (e.walk?.dir === 'left' && e.stroll?.flip !== false) ox = -ox;
    const oy = amount >= 0.25 && dy / d < -0.25 ? -1 : 0;
    // They draw themselves as always, but every picture they draw is swapped
    // for its lit copy (made once per picture, light colour, step and side).
    litDraw.ctx = ctx;
    litDraw.key = `${l.color}|${amount}|${ox}|${oy}`;
    litDraw.color = l.color;
    litDraw.amount = amount;
    litDraw.ox = ox;
    litDraw.oy = oy;
    e.draw(litDraw.proxy, this.scene.camera);
    litDraw.ctx = null;
    return true;
  }

  // How much the lightning lifts the room's shade just now (0 to 0.5).
  get flashLift() {
    return this.outside ? Math.min(0.5, this.flash * 0.55) : 0;
  }

  // --- Window light (on the floor, under everyone and under the room's shade) ---

  drawWindows(ctx) {
    const s = this.scene;
    if (s.spire || s.roomData.dynamicLight === false) return;
    if (s.lamplit && this.outside && this.dimK > 0.05) this.drawSpills(ctx);
    if (s.lamplit && s.roomData.indoors && s.roomData.windowShafts !== false) this.drawShafts(ctx);
  }

  // Outdoors: every lit window's light spilt on the ground in front of it.
  // The windows are found once a room (a window tile with its own pool of
  // light just below it, so a dark window spills nothing).
  drawSpills(ctx) {
    const s = this.scene;
    const list = this.list;
    if (!list) return;
    if (this.spillsFor !== list.version || !this.spills) {
      this.spillsFor = list.version;
      this.spills = [];
      const room = s.room;
      const coast = COAST_AREAS.has(s.roomData.area);
      room.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
        if (!WINDOW_TILES.has(char) && !(coast && char === COAST_WINDOW)) return;
        const cx = tx * T + T / 2;
        const light = list.find((l) => l.pool && !l.sky && Math.abs(l.x - cx) < 6 && l.y > ty * T && l.y < ty * T + 48);
        if (!light) return;
        let ground = ty + 1;
        while (ground < ty + 3 && TILES[room.tileAt(tx, ground)]?.solid) ground++;
        if (TILES[room.tileAt(tx, ground)]?.solid || room.tileAt(tx, ground) === null) return;
        this.spills.push({ x: cx, y: ground * T, light });
      }));
    }
    if (!this.spills.length) return;
    const cam = s.camera;
    const t = s.time;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const { x, y, light } of this.spills) {
      const px = Math.round(x - cam.x) - 12;
      const py = Math.round(y - cam.y);
      if (px < -24 || px > W || py < -16 || py > H) continue;
      const k = light.strength * flickerAt(light, t);
      ctx.globalAlpha = Math.round(Math.min(0.9, k * this.dimK * 1.2) * 10) / 10;
      if (ctx.globalAlpha < 0.05) continue;
      ctx.drawImage(spillSprite(light.color), px, py);
    }
    ctx.restore();
  }

  // Indoors: daylight through the windows, falling across the floor. Coast
  // windows in the back wall, and any prop whose light is the sky's (the
  // chapel's stained glass). Found once a room.
  findShafts() {
    const s = this.scene;
    const room = s.room;
    const out = [];
    const coast = COAST_AREAS.has(s.roomData.area);
    // (A room that already stands a shaft of its own on the floor keeps to it.)
    if (room.props.some((p) => /shaft/.test(p.look ?? ''))) return out;
    if (coast) {
      room.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
        if (char !== COAST_WINDOW) return;
        let floor = ty + 1;
        while (floor < ty + 3 && TILES[room.tileAt(tx, floor)]?.solid) floor++;
        if (TILES[room.tileAt(tx, floor)]?.solid || room.tileAt(tx, floor) === null) return;
        out.push({ x: tx * T + T / 2, y: ty * T + 12, width: 8, length: (floor - ty) * T + 22 });
      }));
    }
    for (const prop of room.props) {
      const list = prop.glow ?? PROP_GLOWS[prop.look];
      if (!list || prop.hidden) continue;
      const bloom = list.find((l) => l.sky && l.bloom);
      const pool = list.find((l) => l.sky && l.pool);
      if (!bloom || !pool) continue;
      const footX = prop.x + prop.width / 2;
      const footY = prop.y + T - (prop.raise ?? 0);
      const top = footY + (bloom.dy ?? 0) + Math.round(bloom.bloom * 0.4);
      const bottom = footY + (pool.dy ?? 0) + Math.round(pool.pool * 0.15);
      if (bottom - top < 12) continue;
      out.push({ x: footX + (bloom.dx ?? 0), y: top, width: Math.max(8, Math.round(bloom.bloom * 0.7)), length: bottom - top });
    }
    return out;
  }

  drawShafts(ctx) {
    const s = this.scene;
    this.shaftList ??= this.findShafts();
    if (!this.shaftList.length) return;
    const { night, dusk } = daylight();
    const calm = s.roomData.calmAfter;
    const storm = Boolean(calm) && !(WORLD_STATE.seenScenes ?? []).includes(calm.scene);
    // In the storm: a grey-green light, day or night. Otherwise the day's
    // own: warm, gold at dusk, the moon's faint blue at night.
    let color = SHAFT_DAY;
    let strength = 0.55 * (1 - night);
    if (storm) { color = SHAFT_STORM; strength = 0.5; }
    else if (night > 0.5) { color = SHAFT_MOON; strength = 0.25 * night; }
    else if (dusk > 0.4) { color = SHAFT_DUSK; strength = 0.5; }
    if (strength < 0.05) return;
    // Leaning the way the sun's shadows lean, in steps (and straight down in the storm).
    const lean = storm ? 0.15 : Math.round(0.45 * Math.cos(timeOfDay() * Math.PI * 2) * 4) / 4 * 0.6;
    const cam = s.camera;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, Math.round(strength * 1.4 * 10) / 10);
    for (const shaft of this.shaftList) {
      const sprite = shaftSprite(color, shaft.width, shaft.length, lean);
      const left = lean < 0 ? Math.ceil(Math.abs(lean) * shaft.length) + 1 : 1;
      const px = Math.round(shaft.x - shaft.width / 2 - cam.x) - left;
      const py = Math.round(shaft.y - cam.y);
      if (px > W || py > H || px + sprite.width < 0 || py + sprite.height < 0) continue;
      ctx.drawImage(sprite, px, py);
    }
    ctx.restore();
  }
}

export function makeDynamicLight(scene) {
  if (scene.spire) return null;
  return new DynamicLight(scene);
}
