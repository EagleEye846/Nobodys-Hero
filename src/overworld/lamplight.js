import { TILE_SIZE as T } from '../config.js';
import { TILES } from './tileset.js';
import { LAMPLIT_AREAS } from '../data/areas.js';
import { brightTileLights } from './brightTiles.js';
import { coastTileLights } from './coastTiles.js';
import { BRIGHT_GLOWS } from '../data/art/brightProps.js';
import { COAST_GLOWS } from '../data/art/coastProps.js';
import { IN_GLOWS } from '../data/art/interiorProps.js';
import { TH_GLOWS } from '../data/art/taperHouse.js';
import { GS_GLOWS } from '../data/art/ghostShip.js';
import { WORLD_STATE } from '../state/saveGame.js';

// Lamplight: how a lived-in place is lit by its own flames. The Ruins' dark
// rooms (`dark`) are about your candle against the black; this is gentler.
// In a lamplit room (any room in LAMPLIT_AREAS, or one with `lamplight`):
//
// - Outdoors, after sunset the night comes down deeper than on the open
//   mountain, and every street lamp, brazier, lit window and open door keeps
//   a warm pool of light on the snow, flickering a little. By day the lamps
//   are only a faint warmth.
// - Indoors, the room is dim and warm between its lights, and lit by its
//   fires and candles, a little darker at night. Windows with `sky` light
//   (the chapel's stained glass) let in pale daylight, and moonlight at night.
//
// It never counts as a dark room: no candle burns, nothing is hidden.
//
// A room can say `lamplight: false` to opt out, or set how dark it is
// between its lights: `lamplight: { shade: 0.34, nightShade: 0.14 }`
// (indoors: by day, and how much darker at midnight) or `{ night: 0.6 }`
// (outdoors, at midnight).
//
// What glows comes from PROP_GLOWS below (by sprite), or a prop's own `glow`
// (the same kind of list, or `false` for none), plus the village's tiles: lit
// cabin windows `w` and doorways `D` in a cabin wall.

// Colours of light, as 'r, g, b'.
const FIRE = '255, 128, 48';
const LAMP = '255, 156, 68';
const CANDLE = '255, 180, 92';
const CRYSTAL = '255, 210, 120';
const DAYLIGHT = '255, 246, 228';
const MOONLIGHT = '140, 172, 255';

// Each light is placed from the middle of the foot of its prop (`dx`, `dy` in
// pixels, up is negative), and is either a `pool` (light falling round about:
// the shade is lifted and the ground warmed, `pool` pixels wide) or a `bloom`
// (the glow of the flame itself, added on top). `strength` 0 to 1, `flicker`
// how much a flame wavers (0 for steady glass), and `sky` for windows that
// let the day (or the moon) in instead of a flame's colour.
export const PROP_GLOWS = {
  street_lamp: [
    { dy: -20, bloom: 16, strength: 0.75, flicker: 0.3, color: LAMP },
    { dy: -6, pool: 56, strength: 0.62, flicker: 0.2, color: LAMP },
  ],
  lantern_post_on: [
    { dy: -20, bloom: 14, strength: 0.7, flicker: 0.4, color: LAMP },
    { dy: -6, pool: 52, strength: 0.55, flicker: 0.3, color: LAMP },
  ],
  brazier: [
    { dy: -12, bloom: 18, strength: 0.7, flicker: 1, color: FIRE },
    { dy: -6, pool: 60, strength: 0.6, flicker: 0.8, color: FIRE },
  ],
  campfire: [
    { dy: -10, bloom: 18, strength: 0.7, flicker: 1, color: FIRE },
    { dy: -4, pool: 60, strength: 0.6, flicker: 0.8, color: FIRE },
  ],
  // The hearth: the fire, the candles on the mantel, and the glow it throws
  // out across the floor in front of it.
  fireplace: [
    { dy: -13, bloom: 24, strength: 0.65, flicker: 1, color: FIRE },
    { dx: -16, dy: -31, bloom: 7, strength: 0.5, flicker: 0.6, color: CANDLE },
    { dx: 16, dy: -31, bloom: 7, strength: 0.5, flicker: 0.6, color: CANDLE },
    { dy: 6, pool: 92, strength: 0.6, flicker: 0.7, color: FIRE },
  ],
  stove: [{ dy: -4, pool: 34, strength: 0.3, flicker: 0.5, color: FIRE }],
  stove_pot: [
    { dy: -4, bloom: 8, strength: 0.5, flicker: 1, color: FIRE },
    { dy: -2, pool: 36, strength: 0.35, flicker: 0.6, color: FIRE },
  ],
  lamp: [
    { dy: -16, bloom: 12, strength: 0.6, flicker: 0.3, color: LAMP },
    { dy: -8, pool: 48, strength: 0.5, flicker: 0.2, color: LAMP },
  ],
  side_table: [
    { dy: -18, bloom: 8, strength: 0.6, flicker: 0.6, color: CANDLE },
    { dy: -8, pool: 38, strength: 0.4, flicker: 0.5, color: CANDLE },
  ],
  table: [
    { dx: -1, dy: -22, bloom: 8, strength: 0.6, flicker: 0.6, color: CANDLE },
    { dx: -1, dy: -10, pool: 44, strength: 0.4, flicker: 0.5, color: CANDLE },
  ],
  counter_cake: [{ dy: -24, bloom: 6, strength: 0.5, flicker: 0.6, color: CANDLE }],
  // The chapel: candles on the altar and the stands either side of it, the
  // rack of prayer candles by the door, and the stained glass.
  chapel_candles: [
    { dy: -28, bloom: 18, strength: 0.65, flicker: 0.7, color: CANDLE },
    { dy: -12, pool: 58, strength: 0.6, flicker: 0.6, color: CANDLE },
  ],
  chapel_altar: [
    { dx: -16, dy: -29, bloom: 10, strength: 0.6, flicker: 0.7, color: CANDLE },
    { dx: 16, dy: -29, bloom: 10, strength: 0.6, flicker: 0.7, color: CANDLE },
    { dy: -10, pool: 62, strength: 0.5, flicker: 0.5, color: CANDLE },
  ],
  votive_rack: [
    { dy: -14, bloom: 20, strength: 0.6, flicker: 0.8, color: CANDLE },
    { dy: -6, pool: 52, strength: 0.55, flicker: 0.6, color: CANDLE },
  ],
  chapel_rose: [
    { dy: -16, bloom: 26, strength: 0.25, flicker: 0, sky: true },
    { dy: 34, pool: 72, strength: 0.45, flicker: 0, sky: true },
  ],
  chapel_lancet: [
    { dy: -14, bloom: 14, strength: 0.25, flicker: 0, sky: true },
    { dy: 24, pool: 46, strength: 0.4, flicker: 0, sky: true },
  ],
};

// The mines' dim old lamps, the lake's glowing reeds, the crystal roots of
// the Deep: lights for the props in src/data/art/deepProps.js.
const REED = '150, 230, 220';
const ROOT = '150, 215, 255';
Object.assign(PROP_GLOWS, {
  mine_lamp: [
    { dy: -14, bloom: 10, strength: 0.55, flicker: 0.35, color: LAMP },
    { dy: -6, pool: 44, strength: 0.42, flicker: 0.25, color: LAMP },
  ],
  mine_lamp_hung: [
    { dy: -14, bloom: 10, strength: 0.55, flicker: 0.35, color: LAMP },
    { dy: -2, pool: 44, strength: 0.42, flicker: 0.25, color: LAMP },
  ],
  glow_reeds: [
    { dy: -12, bloom: 14, strength: 0.4, flicker: 0, color: REED, sings: true },
    { dy: -4, pool: 40, strength: 0.34, flicker: 0, color: REED, sings: true },
  ],
  glow_reeds_tall: [
    { dy: -16, bloom: 16, strength: 0.4, flicker: 0, color: REED, sings: true },
    { dy: -4, pool: 46, strength: 0.34, flicker: 0, color: REED, sings: true },
  ],
  fungus_pads: [{ dy: -2, pool: 26, strength: 0.22, flicker: 0, color: REED, sings: true }],
  root_vein_lit: [
    { dy: -14, bloom: 16, strength: 0.5, flicker: 0, color: ROOT },
    { dy: -6, pool: 60, strength: 0.5, flicker: 0, color: ROOT },
  ],
});

// The Glimmering's crystals and mushrooms, Belowtown's glow-worm lamps
// (src/data/art/brightProps.js).
Object.assign(PROP_GLOWS, BRIGHT_GLOWS);
// Chapter 5's coast lamps, forge and great lens (src/data/art/coastProps.js).
Object.assign(PROP_GLOWS, COAST_GLOWS);
// Chapter 5's indoor wall lamps, kettle stoves and windows (src/data/art/interiorProps.js).
Object.assign(PROP_GLOWS, IN_GLOWS);
// Mother Taper's hearth, wax pots, candle sconces and glasshouse panes (src/data/art/taperHouse.js).
Object.assign(PROP_GLOWS, TH_GLOWS);
// The ghost ship's lantern and harmonium (src/data/art/ghostShip.js).
Object.assign(PROP_GLOWS, GS_GLOWS);

// Lit cabin windows and open doors, outdoors.
const WINDOW_GLOW = [
  { dy: 6, bloom: 10, strength: 0.55, flicker: 0.15, color: CANDLE },
];
const WINDOW_POOL = { pool: 26, strength: 0.42, flicker: 0.15, color: CANDLE };
// A save crystal's own warm light.
const SAVE_GLOW = [{ dy: -10, pool: 40, strength: 0.5, flicker: 0, color: CRYSTAL }];
const DOOR_GLOW = [
  { dy: 9, bloom: 10, strength: 0.4, flicker: 0.4, color: FIRE },
  { dy: 20, pool: 32, strength: 0.5, flicker: 0.4, color: FIRE },
];
const isCabinWall = (c) => c === 'a' || c === 'w';

// How dark it gets between the lights, unless the room says otherwise.
const OUTDOOR_NIGHT = 0.72;
const INDOOR_SHADE = 0.34;
const INDOOR_NIGHT = 0.14;
// The shade's colour: the night's blue outdoors, an ember brown indoors.
export const NIGHT_TINT = '8, 12, 40';
const HEARTH_TINT = '30, 14, 6';
// By day, outdoor lamps are only this strong (a hint of warmth near them).
const DAY_GLOW = 0.1;

// Whether a room is lit this way.
export function isLamplit(data) {
  if (data.dark) return false;
  if (data.lamplight !== undefined) return Boolean(data.lamplight);
  return LAMPLIT_AREAS.has(data.area);
}

// The lights of a room's tiles never change, so they're found once per room.
const tileLights = new WeakMap();
function lightsOfTiles(room, outdoors) {
  if (tileLights.has(room)) return tileLights.get(room);
  const lights = [];
  const place = (list, x, y) => list.forEach((l) => lights.push({ ...l, x: x + (l.dx ?? 0), y: y + (l.dy ?? 0) }));
  if (outdoors) {
    room.tiles.forEach((row, ty) => [...row].forEach((char, tx) => {
      const cx = tx * T + T / 2;
      if (char === 'w') {
        place(WINDOW_GLOW, cx, ty * T);
        // The window's light falls on the first open ground in front of the wall.
        let ground = ty + 1;
        while (ground < ty + 3 && TILES[room.tileAt(tx, ground)]?.solid) ground++;
        if (!TILES[room.tileAt(tx, ground)]?.solid) place([WINDOW_POOL], cx, ground * T + 5);
      }
      // A door in a cabin wall, with the firelight inside spilling out.
      if (char === 'D' && (isCabinWall(room.tileAt(tx - 1, ty)) || isCabinWall(room.tileAt(tx + 1, ty)))) {
        place(DOOR_GLOW, cx, ty * T);
      }
    }));
  }
  // Crystals, glowing water and lit windows drawn into the Glimmering's and
  // Belowtown's tiles (see brightTiles.js).
  lights.push(...brightTileLights(room), ...coastTileLights(room));
  tileLights.set(room, lights);
  return lights;
}

// Every light in the room right now, in world pixels, each with a `phase`
// so they don't all flicker together.
export function roomLights(room, outdoors) {
  const lights = [...lightsOfTiles(room, outdoors)];
  for (const prop of room.props) {
    if (prop.hidden || prop.isOpen) continue;
    const list = prop.glow ?? PROP_GLOWS[prop.look] ?? (prop.save ? SAVE_GLOW : null);
    if (!list) continue;
    const footX = prop.x + prop.width / 2;
    const footY = prop.y + T - (prop.raise ?? 0);
    for (const l of list) lights.push({ ...l, x: footX + (l.dx ?? 0), y: footY + (l.dy ?? 0), ...(prop.pulse ? { beat: true } : {}) });
  }
  for (const l of lights) l.phase ??= (l.x * 0.37 + l.y * 0.61) % (Math.PI * 2);
  return lights;
}

// The lights a prop gives off, or null.
const glowOf = (prop) => prop.glow ?? PROP_GLOWS[prop.look] ?? (prop.save ? SAVE_GLOW : null);

// The same lights as roomLights, kept from frame to frame: the tiles' once,
// each prop's made once and only moved when the prop moves (a lamplighter
// strolling with her lamp, a lantern on a floating crate), and the list put
// together again only when a prop's light comes or goes (hidden, opened, lit).
// The same light objects come back each frame, so nothing is made fresh.
const kept = new WeakMap();
export function cachedRoomLights(room, outdoors) {
  let c = kept.get(room);
  if (!c || c.outdoors !== outdoors || c.count !== room.props.length) {
    const tiles = lightsOfTiles(room, outdoors).map((l) => ({ ...l, phase: l.phase ?? (l.x * 0.37 + l.y * 0.61) % (Math.PI * 2) }));
    c = { outdoors, count: room.props.length, tiles, props: room.props.map((prop) => ({ prop, list: null, lights: null, x: NaN, y: NaN, on: false })), out: null };
    kept.set(room, c);
  }
  let dirty = !c.out;
  for (const e of c.props) {
    const { prop } = e;
    const list = glowOf(prop);
    const on = Boolean(list) && !prop.hidden && !prop.isOpen;
    if (list !== e.list || Boolean(prop.pulse) !== e.pulse) {
      e.list = list;
      e.pulse = Boolean(prop.pulse);
      e.lights = list ? list.map((l) => ({ ...l, ...(prop.pulse ? { beat: true } : {}) })) : null;
      e.x = NaN;
      dirty = true;
    }
    if (on !== e.on) { e.on = on; dirty = true; }
    if (!e.lights) continue;
    const footX = prop.x + prop.width / 2;
    const footY = prop.y + T - (prop.raise ?? 0);
    if (footX === e.x && footY === e.y) continue;
    const first = Number.isNaN(e.x);
    e.x = footX;
    e.y = footY;
    e.list.forEach((l, i) => {
      const light = e.lights[i];
      light.x = footX + (l.dx ?? 0);
      light.y = footY + (l.dy ?? 0);
      if (first) light.phase = l.phase ?? (light.x * 0.37 + light.y * 0.61) % (Math.PI * 2);
    });
  }
  if (dirty) {
    c.out = [...c.tiles];
    for (const e of c.props) if (e.on) c.out.push(...e.lights);
    c.version = (c.version ?? 0) + 1;
    c.out.version = c.version;
  }
  return c.out;
}

// A flame's light breathes as well as wavers: its reach swells and shrinks a
// little (a fire quickly and raggedly, a lantern slowly), as a share of its
// size. Steady glass and crystals don't. Kept to whole pixels by the caller.
export function breatheAt(light, time) {
  const amount = light.flicker ?? 0;
  if (!amount) return 1;
  const p = light.phase ?? 0;
  const fire = amount >= 0.7;
  const wave = fire
    ? Math.sin(time * 4.1 + p) * 0.6 + Math.sin(time * 10.7 + p * 2.3) * 0.4
    : Math.sin(time * 1.4 + p) * 0.75 + Math.sin(time * 3.3 + p * 1.9) * 0.25;
  return 1 + wave * (fire ? 0.06 : 0.035) * Math.min(1, amount * 1.5);
}

// Chapter 4's underground regions have their own light: the Diggings are a
// dusty brown dim, the Stillwater a cool blue one, and neither cares what
// time it is up top. A room can still say `lamplight: { shade, tint }`.
const AREA_AMBIENT = {
  diggings: { shade: 0.36, nightShade: 0, tint: '34, 18, 6' },
  stillwater: { shade: 0.5, nightShade: 0, tint: '2, 8, 32' },
  // The Glimmering is lit by its crystals (a soft violet between them);
  // Belowtown by its lamps, glow-worm strings and the Sunstone overhead.
  glimmer: { shade: 0.24, nightShade: 0, tint: '28, 10, 64' },
  // Once the Sunstone is relit (`relit.after` has played) the town isn't
  // dim any more: a warm noon with hardly any shade. A room opts out with
  // `lamplight: { relit: false }`.
  belowtown: { shade: 0.28, nightShade: 0, tint: '30, 14, 8', relit: { after: 'the_light_goes_up', shade: 0.025, tint: '96, 60, 12' } },
  // Chapter 5's green storm (see src/overworld/coastTiles.js): the tint is a
  // dark teal-green laid over everything except where a lamp or window lifts
  // it, and it gets deeper and greener area by area, the Wrack Shore least,
  // the Last Light most. `inside` is what a room with `indoors: true` uses
  // instead: still dim, but a warmer hearth brown. The time of day never
  // changes any of it.
  wrack: { shade: 0.3, nightShade: 0, tint: '10, 52, 46', inside: { shade: 0.3, tint: '26, 22, 14' } },
  saltcombe: { shade: 0.42, nightShade: 0, tint: '6, 34, 32', inside: { shade: 0.24, tint: '34, 16, 6' } },
  lanes: { shade: 0.38, nightShade: 0, tint: '8, 52, 42', inside: { shade: 0.3, tint: '26, 22, 14' } },
  wreck: { shade: 0.46, nightShade: 0, tint: '8, 50, 38', inside: { shade: 0.4, tint: '14, 28, 20' } },
  // The ghost ship: darker than the yard round it, a cold grey-green, and the lit lamps and lantern do the rest.
  ghostship: { shade: 0.54, nightShade: 0, tint: '6, 30, 34', inside: { shade: 0.52, tint: '8, 18, 22' } },
  merrow: { shade: 0.5, nightShade: 0, tint: '6, 40, 38', inside: { shade: 0.4, tint: '14, 28, 24' } },
  soundings: { shade: 0.55, nightShade: 0, tint: '4, 22, 30', inside: { shade: 0.55, tint: '4, 22, 30' } },
  isles: { shade: 0.5, nightShade: 0, tint: '6, 52, 36', inside: { shade: 0.36, tint: '30, 18, 8' } },
  haddock_light: { shade: 0.44, nightShade: 0, tint: '6, 46, 38', inside: { shade: 0.26, tint: '36, 18, 6' } },
  reach: { shade: 0.56, nightShade: 0, tint: '4, 54, 34', inside: { shade: 0.4, tint: '14, 30, 20' } },
  lastlight: { shade: 0.62, nightShade: 0, tint: '2, 50, 28', inside: { shade: 0.42, tint: '24, 18, 8' } },
};

// Whether the room's light has been lifted by a scene (see AREA_AMBIENT).
export function isRelit(data) {
  const relit = { ...AREA_AMBIENT[data.area], ...(typeof data.lamplight === 'object' ? data.lamplight : {}) }.relit;
  return Boolean(relit && (WORLD_STATE.seenScenes ?? []).includes(relit.after));
}

// How dark the room is between its lights, the shade's colour, and how
// strongly its lights show, for the time of day.
export function ambientFor(data, outdoors, night) {
  const own = { ...AREA_AMBIENT[data.area], ...(data.indoors ? AREA_AMBIENT[data.area]?.inside : null), ...(typeof data.lamplight === 'object' ? data.lamplight : {}) };
  if (isRelit(data)) Object.assign(own, own.relit);
  // A room's `calmAfter` can bring its own light too, once its scene has played
  // (the foot of the Last Light, the grey before dawn after the storm).
  const calm = data.calmAfter;
  if (calm?.lamplight && (WORLD_STATE.seenScenes ?? []).includes(calm.scene)) Object.assign(own, calm.lamplight);
  if (outdoors) {
    const lit = DAY_GLOW + (1 - DAY_GLOW) * Math.min(1, night * 1.4);
    return { shade: night * (own.night ?? OUTDOOR_NIGHT), tint: NIGHT_TINT, lit };
  }
  return { shade: (own.shade ?? INDOOR_SHADE) + night * (own.nightShade ?? INDOOR_NIGHT), tint: own.tint ?? HEARTH_TINT, lit: 1 };
}

// A flame's waver: two slow sines and a quick one, so it never quite repeats.
export function flickerAt(light, time) {
  const amount = light.flicker ?? 0;
  if (!amount) return 1;
  const p = light.phase ?? 0;
  const wave = Math.sin(time * 5.3 + p) * 0.5 + Math.sin(time * 8.9 + p * 1.7) * 0.3 + Math.sin(time * 23 + p * 3.1) * 0.2;
  return 1 + wave * amount * 0.12;
}

// The colour of a `sky` window: daylight, going blue as the moon takes over.
export function skyColor(night) {
  // In steps, so only a handful of colours are ever drawn.
  night = Math.round(night * 16) / 16;
  const day = DAYLIGHT.split(',').map(Number);
  const moon = MOONLIGHT.split(',').map(Number);
  return day.map((c, i) => Math.round(c + (moon[i] - c) * night)).join(', ');
}

// Soft round light, drawn once per colour and scaled to fit (so nothing is
// made fresh each frame). The hole is the shape cut out of the shade; the
// glow is the light itself, brightest in the middle.
const SPRITE_SIZE = 128;
const glowSprites = new Map();
let holeCanvas = null;
export function holeSprite() {
  if (holeCanvas) return holeCanvas;
  holeCanvas = Object.assign(document.createElement('canvas'), { width: SPRITE_SIZE, height: SPRITE_SIZE });
  const ctx = holeCanvas.getContext('2d');
  const r = SPRITE_SIZE / 2;
  // The same falloff the dark rooms have always had.
  const hole = ctx.createRadialGradient(r, r, r * 0.15, r, r, r);
  hole.addColorStop(0, 'rgba(0, 0, 0, 1)');
  hole.addColorStop(0.45, 'rgba(0, 0, 0, 0.75)');
  hole.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = hole;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return holeCanvas;
}
export function glowSprite(color) {
  if (glowSprites.has(color)) return glowSprites.get(color);
  const canvas = Object.assign(document.createElement('canvas'), { width: SPRITE_SIZE, height: SPRITE_SIZE });
  const ctx = canvas.getContext('2d');
  const r = SPRITE_SIZE / 2;
  const glow = ctx.createRadialGradient(r, r, 0, r, r, r);
  glow.addColorStop(0, `rgba(${color}, 1)`);
  glow.addColorStop(0.35, `rgba(${color}, 0.72)`);
  glow.addColorStop(0.7, `rgba(${color}, 0.28)`);
  glow.addColorStop(1, `rgba(${color}, 0)`);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  // Keep the cache small: a sky window's colour drifts with the day.
  if (glowSprites.size > 48) glowSprites.clear();
  glowSprites.set(color, canvas);
  return canvas;
}
