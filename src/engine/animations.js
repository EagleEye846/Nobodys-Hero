import { ART_MODULES } from '../data/artManifest.js';
import { makeSprite } from './sprite.js';

// Animations: any sprite in src/data/art/ with several frames of the same size
// (an export NAME_SPRITES = { frame: rows, ... } with its NAME_PALETTE), like
// the ones the Sprite Editor makes. Each is named after its export in
// snake_case: TAPER_WATERING_SPRITES is 'taper_watering'. Room characters,
// objects and cutscene actors can play them.

export const DEFAULT_FRAME_SECONDS = 0.25;

const isRows = (value) => Array.isArray(value) && value.length > 0 && value.every((row) => typeof row === 'string');

// The palette for NAME_SPRITES: NAME_PALETTE, or the longest matching prefix (PLAYER_RUN uses PLAYER_PALETTE).
function paletteFor(module, base) {
  const parts = base.split('_');
  while (parts.length) {
    const palette = module[`${parts.join('_')}_PALETTE`];
    if (palette) return palette;
    parts.pop();
  }
  return null;
}

function findAnimations() {
  const found = {};
  for (const module of Object.values(ART_MODULES)) {
    for (const [name, value] of Object.entries(module)) {
      if (!name.endsWith('_SPRITES') || !value || Array.isArray(value)) continue;
      const frames = Object.values(value).filter(isRows);
      if (frames.length < 2) continue;
      // Every frame the same size, so it animates in place (rules out sets of different props).
      if (frames.some((f) => f.length !== frames[0].length || f[0].length !== frames[0][0].length)) continue;
      const base = name.slice(0, -'_SPRITES'.length);
      const palette = paletteFor(module, base);
      if (palette) found[base.toLowerCase()] = { frames, palette };
    }
  }
  return found;
}

const ANIMATIONS = findAnimations();
export const ANIMATION_NAMES = Object.keys(ANIMATIONS).sort();

const canvases = new Map();
function framesOf(name) {
  if (!canvases.has(name)) {
    const animation = ANIMATIONS[name];
    canvases.set(name, animation ? animation.frames.map((rows) => makeSprite(rows, animation.palette)) : null);
  }
  return canvases.get(name);
}

// The frame to show `seconds` into a looping animation, or null if there's no
// animation by that name.
export function animationFrame(name, seconds, frameSeconds = DEFAULT_FRAME_SECONDS) {
  const frames = framesOf(name);
  if (!frames) return null;
  return frames[Math.floor(seconds / frameSeconds) % frames.length];
}
