import { TILE_SIZE as T } from '../config.js';
import { TILES } from './tileset.js';
import { LAMPLIT_AREAS } from '../data/areas.js';

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
    for (const l of list) lights.push({ ...l, x: footX + (l.dx ?? 0), y: footY + (l.dy ?? 0) });
  }
  for (const l of lights) l.phase ??= (l.x * 0.37 + l.y * 0.61) % (Math.PI * 2);
  return lights;
}

// How dark the room is between its lights, the shade's colour, and how
// strongly its lights show, for the time of day.
export function ambientFor(data, outdoors, night) {
  const own = typeof data.lamplight === 'object' ? data.lamplight : {};
  if (outdoors) {
    const lit = DAY_GLOW + (1 - DAY_GLOW) * Math.min(1, night * 1.4);
    return { shade: night * (own.night ?? OUTDOOR_NIGHT), tint: NIGHT_TINT, lit };
  }
  return { shade: (own.shade ?? INDOOR_SHADE) + night * (own.nightShade ?? INDOOR_NIGHT), tint: HEARTH_TINT, lit: 1 };
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
